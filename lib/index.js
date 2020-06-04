"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiffMethod = exports.LineNumberPrefix = void 0;
var React = require("react");
var PropTypes = require("prop-types");
var classnames_1 = require("classnames");
var compute_lines_1 = require("./compute-lines");
Object.defineProperty(exports, "DiffMethod", { enumerable: true, get: function () { return compute_lines_1.DiffMethod; } });
var styles_1 = require("./styles");
// eslint-disable-next-line @typescript-eslint/no-var-requires
var m = require('memoize-one');
var memoize = m.default || m;
var LineNumberPrefix;
(function (LineNumberPrefix) {
    LineNumberPrefix["LEFT"] = "L";
    LineNumberPrefix["RIGHT"] = "R";
})(LineNumberPrefix = exports.LineNumberPrefix || (exports.LineNumberPrefix = {}));
var DiffViewer = /** @class */ (function (_super) {
    __extends(DiffViewer, _super);
    function DiffViewer(props) {
        var _this = _super.call(this, props) || this;
        /**
         * Resets code block expand to the initial stage. Will be exposed to the parent component via
         * refs.
         */
        _this.resetCodeBlocks = function () {
            if (_this.state.expandedBlocks.length > 0) {
                _this.setState({
                    expandedBlocks: []
                });
                return true;
            }
            return false;
        };
        /**
         * Pushes the target expanded code block to the state. During the re-render,
         * this value is used to expand/fold unmodified code.
         */
        _this.onBlockExpand = function (id) {
            var prevState = _this.state.expandedBlocks.slice();
            prevState.push(id);
            _this.setState({
                expandedBlocks: prevState
            });
        };
        /**
         * Computes final styles for the diff viewer. It combines the default styles with the user
         * supplied overrides. The computed styles are cached with performance in mind.
         *
         * @param styles User supplied style overrides.
         */
        _this.computeStyles = memoize(styles_1.default);
        /**
         * Returns a function with clicked line number in the closure. Returns an no-op function when no
         * onLineNumberClick handler is supplied.
         *
         * @param id Line id of a line.
         * @param uniqueLineId uniqueLineId of a line.
         */
        _this.onLineNumberClickProxy = function (id, uniqueLineId) {
            if (_this.props.onLineNumberClick) {
                return function (e) {
                    return _this.props.onLineNumberClick(id, uniqueLineId, e);
                };
            }
            return function () { };
        };
        /**
         * Maps over the word diff and constructs the required React elements to show word diff.
         *
         * @param diffArray Word diff information derived from line information.
         * @param renderer Optional renderer to format diff words. Useful for syntax highlighting.
         */
        _this.renderWordDiff = function (diffArray, lineId, renderer) {
            return diffArray.map(function (wordDiff, i) {
                var _a;
                return (React.createElement("span", { key: i, className: classnames_1.default(_this.styles.wordDiff, (_a = {},
                        _a[_this.styles.wordAdded] = wordDiff.type === compute_lines_1.DiffType.ADDED,
                        _a[_this.styles.wordRemoved] = wordDiff.type === compute_lines_1.DiffType.REMOVED,
                        _a)) }, renderer
                    ? renderer(wordDiff.value, lineId)
                    : wordDiff.value));
            });
        };
        /**
         * Maps over the line diff and constructs the required react elements to show line diff. It calls
         * renderWordDiff when encountering word diff. This takes care of both inline and split view line
         * renders.
         *
         * @param lineNumber Line number of the current line.
         * @param type Type of diff of the current line.
         * @param prefix Unique id to prefix with the line numbers.
         * @param value Content of the line. It can be a string or a word diff array.
         * @param additionalLineNumber Additional line number to be shown. Useful for rendering inline
         *  diff view. Right line number will be passed as additionalLineNumber.
         * @param additionalPrefix Similar to prefix but for additional line number.
         */
        _this.renderLine = function (lineNumber, type, prefix, value, commentInfo, additionalLineNumber, additionalPrefix) {
            var _a, _b, _c, _d;
            var lineNumberTemplate = prefix + "-" + lineNumber;
            var additionalLineNumberTemplate = additionalPrefix + "-" + additionalLineNumber;
            var highlightLine = _this.props.highlightLines.includes(lineNumberTemplate) ||
                _this.props.highlightLines.includes(additionalLineNumberTemplate);
            var added = type === compute_lines_1.DiffType.ADDED;
            var removed = type === compute_lines_1.DiffType.REMOVED;
            var content;
            if (Array.isArray(value)) {
                content = _this.renderWordDiff(value, commentInfo.lineId, _this.props.renderContent);
            }
            else if (_this.props.renderContent) {
                content = _this.props.renderContent(value, commentInfo.lineId);
            }
            else {
                content = value;
            }
            return (React.createElement(React.Fragment, null,
                !_this.props.hideLineNumbers && (React.createElement("td", { onClick: lineNumber &&
                        _this.onLineNumberClickProxy(lineNumberTemplate, commentInfo.lineId), className: classnames_1.default(_this.styles.gutter, (_a = {},
                        _a[_this.styles.emptyGutter] = !lineNumber,
                        _a[_this.styles.diffAdded] = added,
                        _a[_this.styles.diffRemoved] = removed,
                        _a[_this.styles.highlightedGutter] = highlightLine,
                        _a)) },
                    React.createElement("span", { className: _this.styles.lineNumber }, lineNumber))),
                !_this.props.splitView && !_this.props.hideLineNumbers && (React.createElement("td", { onClick: additionalLineNumber &&
                        _this.onLineNumberClickProxy(additionalLineNumberTemplate, commentInfo.lineId), className: classnames_1.default(_this.styles.gutter, (_b = {},
                        _b[_this.styles.emptyGutter] = !additionalLineNumber,
                        _b[_this.styles.diffAdded] = added,
                        _b[_this.styles.diffRemoved] = removed,
                        _b[_this.styles.highlightedGutter] = highlightLine,
                        _b)) },
                    React.createElement("pre", { className: _this.styles.lineNumber }, additionalLineNumber))),
                React.createElement("td", { className: classnames_1.default(_this.styles.marker, (_c = {},
                        _c[_this.styles.emptyLine] = !content,
                        _c[_this.styles.diffAdded] = added,
                        _c[_this.styles.diffRemoved] = removed,
                        _c[_this.styles.highlightedLine] = highlightLine,
                        _c)) },
                    React.createElement("pre", null,
                        added && '+',
                        removed && '-')),
                React.createElement("td", { className: classnames_1.default(_this.styles.content, _this.styles.plusWrapper, (_d = {},
                        _d[_this.styles.emptyLine] = !content,
                        _d[_this.styles.diffAdded] = added,
                        _d[_this.styles.diffRemoved] = removed,
                        _d[_this.styles.highlightedLine] = highlightLine,
                        _d)) },
                    React.createElement("pre", { className: _this.styles.contentText }, content),
                    React.createElement("button", { className: classnames_1.default(_this.styles.plusBtn, {
                            isPlusBtnShown: (added || removed) &&
                                !_this.props.commentLineIds.includes(commentInfo.lineId) &&
                                _this.props.couldComment
                        }), onClick: _this.getCommentInfoProxy(commentInfo) }, "+"))));
        };
        /**
         *
         * returns commentInfo to client
         *
         * @param commentInfo commentInfo (uniqueLineId, prefix, lineNumber, beforeCommit, afterCommit, fileId) of the current line .
         *
         */
        _this.getCommentInfoProxy = function (commentInfo) {
            if (_this.props.getCommentInfo) {
                return function () { return _this.props.getCommentInfo(commentInfo); };
            }
            return function () { };
        };
        _this.generateCommentInfo = function (lineNumber, specifier, prefix) {
            return {
                lineId: prefix + "-" + lineNumber + "-" + specifier + "-" + _this.props.fileId,
                prefix: prefix,
                lineNumber: lineNumber,
                specifier: specifier,
                fileId: _this.props.fileId
            };
        };
        /**
         *
         * renders comment block (split view)
         *
         * @param leftId left line unique line id
         * @param rightId right line unique line id
         *
         */
        _this.renderSplitCommentBlockProxy = function (leftInfo, rightInfo) {
            var lineIdsArray = _this.props.commentLineIds instanceof Array
                ? _this.props.commentLineIds
                : [];
            if (lineIdsArray.includes(leftInfo.lineId) ||
                lineIdsArray.includes(rightInfo.lineId)) {
                return (React.createElement("tr", null,
                    React.createElement("td", { colSpan: 3 }, lineIdsArray.includes(leftInfo.lineId) &&
                        _this.props.renderCommentBlock(leftInfo)),
                    React.createElement("td", { colSpan: 3 }, lineIdsArray.includes(rightInfo.lineId) &&
                        _this.props.renderCommentBlock(rightInfo))));
            }
            return null;
        };
        /**
         *
         * renders comment block (inline view)
         *
         * @param uniqueLineId unique line id
         *
         */
        _this.renderInlineCommentBlockProxy = function (commentInfo) {
            if (_this.props.commentLineIds &&
                _this.props.commentLineIds.includes(commentInfo.lineId)) {
                return (React.createElement("tr", null,
                    React.createElement("td", { colSpan: 6 }, _this.props.renderCommentBlock(commentInfo))));
            }
            return null;
        };
        /**
         * Generates lines for split view.
         *
         * @param obj Line diff information.
         * @param obj.left Life diff information for the left pane of the split view.
         * @param obj.right Life diff information for the right pane of the split view.
         * @param index React key for the lines.
         */
        _this.renderSplitView = function (_a, index) {
            var left = _a.left, right = _a.right;
            var leftInfo = _this.generateCommentInfo(left.lineNumber, _this.props.beforeCommit + "-" + _this.props.afterCommit, LineNumberPrefix.LEFT);
            var rightInfo = _this.generateCommentInfo(right.lineNumber, _this.props.beforeCommit + "-" + _this.props.afterCommit, LineNumberPrefix.RIGHT);
            return (React.createElement(React.Fragment, { key: index },
                React.createElement("tr", { className: _this.styles.line },
                    _this.renderLine(left.lineNumber, left.type, LineNumberPrefix.LEFT, left.value, leftInfo),
                    _this.renderLine(right.lineNumber, right.type, LineNumberPrefix.RIGHT, right.value, rightInfo)),
                _this.renderSplitCommentBlockProxy(leftInfo, rightInfo)));
        };
        /**
         * Generates lines for inline view.
         *
         * @param obj Line diff information.
         * @param obj.left Life diff information for the added section of the inline view.
         * @param obj.right Life diff information for the removed section of the inline view.
         * @param index React key for the lines.
         */
        _this.renderInlineView = function (_a, index) {
            var left = _a.left, right = _a.right;
            var content;
            var leftInfo = _this.generateCommentInfo(left.lineNumber, _this.props.beforeCommit + "-" + _this.props.afterCommit, LineNumberPrefix.LEFT);
            var rightInfo = _this.generateCommentInfo(right.lineNumber, _this.props.beforeCommit + "-" + _this.props.afterCommit, LineNumberPrefix.RIGHT);
            var currLineInfo;
            if (left.type === compute_lines_1.DiffType.REMOVED && right.type === compute_lines_1.DiffType.ADDED) {
                return (React.createElement(React.Fragment, { key: index },
                    React.createElement("tr", { className: _this.styles.line }, _this.renderLine(left.lineNumber, left.type, LineNumberPrefix.LEFT, left.value, leftInfo, null)),
                    _this.renderInlineCommentBlockProxy(leftInfo),
                    React.createElement("tr", { className: _this.styles.line }, _this.renderLine(null, right.type, LineNumberPrefix.RIGHT, right.value, rightInfo, right.lineNumber)),
                    _this.renderInlineCommentBlockProxy(rightInfo)));
            }
            if (left.type === compute_lines_1.DiffType.REMOVED) {
                content = _this.renderLine(left.lineNumber, left.type, LineNumberPrefix.LEFT, left.value, leftInfo, null);
                currLineInfo = leftInfo;
            }
            if (left.type === compute_lines_1.DiffType.DEFAULT) {
                content = _this.renderLine(left.lineNumber, left.type, LineNumberPrefix.LEFT, left.value, leftInfo, right.lineNumber, LineNumberPrefix.RIGHT);
                currLineInfo = leftInfo;
            }
            if (right.type === compute_lines_1.DiffType.ADDED) {
                content = _this.renderLine(null, right.type, LineNumberPrefix.RIGHT, right.value, rightInfo, right.lineNumber);
                currLineInfo = rightInfo;
            }
            return (React.createElement(React.Fragment, null,
                React.createElement("tr", { key: index, className: _this.styles.line }, content),
                _this.renderInlineCommentBlockProxy(currLineInfo)));
        };
        /**
         * Returns a function with clicked block number in the closure.
         *
         * @param id Cold fold block id.
         */
        _this.onBlockClickProxy = function (id) { return function () {
            return _this.onBlockExpand(id);
        }; };
        /**
         * Generates cold fold block. It also uses the custom message renderer when available to show
         * cold fold messages.
         *
         * @param num Number of skipped lines between two blocks.
         * @param blockNumber Code fold block id.
         * @param leftBlockLineNumber First left line number after the current code fold block.
         * @param rightBlockLineNumber First right line number after the current code fold block.
         */
        _this.renderSkippedLineIndicator = function (num, blockNumber, leftBlockLineNumber, rightBlockLineNumber) {
            var _a;
            var _b = _this.props, hideLineNumbers = _b.hideLineNumbers, splitView = _b.splitView;
            var message = _this.props.codeFoldMessageRenderer ? (_this.props.codeFoldMessageRenderer(num, leftBlockLineNumber, rightBlockLineNumber)) : (React.createElement("pre", { className: _this.styles.codeFoldContent },
                "Expand ",
                num,
                " lines ..."));
            var content = (React.createElement("td", null,
                React.createElement("a", { onClick: _this.onBlockClickProxy(blockNumber), tabIndex: 0 }, message)));
            var isUnifiedViewWithoutLineNumbers = !splitView && !hideLineNumbers;
            return (React.createElement("tr", { key: leftBlockLineNumber + "-" + rightBlockLineNumber, className: _this.styles.codeFold },
                !hideLineNumbers && React.createElement("td", { className: _this.styles.codeFoldGutter }),
                React.createElement("td", { className: classnames_1.default((_a = {},
                        _a[_this.styles.codeFoldGutter] = isUnifiedViewWithoutLineNumbers,
                        _a)) }),
                isUnifiedViewWithoutLineNumbers ? (React.createElement(React.Fragment, null,
                    React.createElement("td", null),
                    content)) : (React.createElement(React.Fragment, null,
                    content,
                    React.createElement("td", null))),
                React.createElement("td", null),
                React.createElement("td", null)));
        };
        /**
         * Generates the entire diff view.
         */
        _this.renderDiff = function () {
            var _a = _this.props, oldValue = _a.oldValue, newValue = _a.newValue, splitView = _a.splitView, disableWordDiff = _a.disableWordDiff, compareMethod = _a.compareMethod, linesOffset = _a.linesOffset;
            var _b = compute_lines_1.computeLineInformation(oldValue, newValue, disableWordDiff, compareMethod, linesOffset), lineInformation = _b.lineInformation, diffLines = _b.diffLines;
            var extraLines = _this.props.extraLinesSurroundingDiff < 0
                ? 0
                : _this.props.extraLinesSurroundingDiff;
            var skippedLines = [];
            return lineInformation.map(function (line, i) {
                var diffBlockStart = diffLines[0];
                var currentPosition = diffBlockStart - i;
                if (_this.props.showDiffOnly) {
                    if (currentPosition === -extraLines) {
                        skippedLines = [];
                        diffLines.shift();
                    }
                    if (line.left.type === compute_lines_1.DiffType.DEFAULT &&
                        (currentPosition > extraLines ||
                            typeof diffBlockStart === 'undefined') &&
                        !_this.state.expandedBlocks.includes(diffBlockStart)) {
                        skippedLines.push(i + 1);
                        if (i === lineInformation.length - 1 && skippedLines.length > 1) {
                            return _this.renderSkippedLineIndicator(skippedLines.length, diffBlockStart, line.left.lineNumber, line.right.lineNumber);
                        }
                        return null;
                    }
                }
                var diffNodes = splitView
                    ? _this.renderSplitView(line, i)
                    : _this.renderInlineView(line, i);
                if (currentPosition === extraLines && skippedLines.length > 0) {
                    var length_1 = skippedLines.length;
                    skippedLines = [];
                    return (React.createElement(React.Fragment, { key: i },
                        _this.renderSkippedLineIndicator(length_1, diffBlockStart, line.left.lineNumber, line.right.lineNumber),
                        diffNodes));
                }
                return diffNodes;
            });
        };
        _this.render = function () {
            var _a;
            var _b = _this.props, oldValue = _b.oldValue, newValue = _b.newValue, useDarkTheme = _b.useDarkTheme, leftTitle = _b.leftTitle, rightTitle = _b.rightTitle, splitView = _b.splitView;
            if (typeof oldValue !== 'string' || typeof newValue !== 'string') {
                throw Error('"oldValue" and "newValue" should be strings');
            }
            _this.styles = _this.computeStyles(_this.props.styles, useDarkTheme);
            var nodes = _this.renderDiff();
            var title = (leftTitle || rightTitle) && (React.createElement("tr", null,
                React.createElement("td", { colSpan: splitView ? 3 : 5, className: _this.styles.titleBlock },
                    React.createElement("pre", { className: _this.styles.contentText }, leftTitle)),
                splitView && (React.createElement("td", { colSpan: 3, className: _this.styles.titleBlock },
                    React.createElement("pre", { className: _this.styles.contentText }, rightTitle)))));
            return (React.createElement("table", { className: classnames_1.default(_this.styles.diffContainer, (_a = {},
                    _a[_this.styles.splitView] = splitView,
                    _a)) },
                React.createElement("tbody", null,
                    title,
                    nodes)));
        };
        _this.state = {
            expandedBlocks: [],
            lineIdPlusShown: ''
        };
        return _this;
    }
    DiffViewer.defaultProps = {
        oldValue: '',
        newValue: '',
        splitView: true,
        highlightLines: [],
        disableWordDiff: false,
        compareMethod: compute_lines_1.DiffMethod.CHARS,
        styles: {},
        hideLineNumbers: false,
        extraLinesSurroundingDiff: 3,
        showDiffOnly: true,
        useDarkTheme: false,
        linesOffset: 0,
        afterCommit: '',
        beforeCommit: '',
        commentLineIds: undefined,
        fileId: '',
        couldComment: true
    };
    DiffViewer.propTypes = {
        oldValue: PropTypes.string.isRequired,
        newValue: PropTypes.string.isRequired,
        splitView: PropTypes.bool,
        disableWordDiff: PropTypes.bool,
        compareMethod: PropTypes.oneOf(Object.values(compute_lines_1.DiffMethod)),
        renderContent: PropTypes.func,
        onLineNumberClick: PropTypes.func,
        extraLinesSurroundingDiff: PropTypes.number,
        styles: PropTypes.object,
        hideLineNumbers: PropTypes.bool,
        showDiffOnly: PropTypes.bool,
        highlightLines: PropTypes.arrayOf(PropTypes.string),
        leftTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
        rightTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
        linesOffset: PropTypes.number,
        couldComment: PropTypes.bool
    };
    return DiffViewer;
}(React.Component));
exports.default = DiffViewer;
