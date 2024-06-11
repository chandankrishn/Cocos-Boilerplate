/**
 * Currently only one -line single -column mode supports.
 *
 */
import {
    _decorator,
    Component,
    Enum,
    error,
    instantiate,
    js,
    Label,
    Node,
    NodePool,
    Prefab,
    ScrollView,
    Size,
    UITransform,
    v2,
    Vec2,
    Vec3,
    warn,
    Widget,
} from "cc";
import { DEBUG, EDITOR } from "cc/env";
import { ViewCell } from "./ViewCell";
const { ccclass, property } = _decorator;

const ScrollModel = Enum({ Horizontal: 0, Vertical: 1 });
const ScrollType = Enum({ Single: 0, Multiple: 1 });

interface viewCell {
    getSize(index: number, data?: any): number;
}

interface tvCell extends Node {
    // Current actual settlement
    tvIndex: number;
    // The subscriber to be transformed (for adding deletion operations)
    _tvIndex: number;
}

@ccclass("TableView")
export class TableView extends ScrollView {
    // Rewriting
    @property({ visible: false, override: true })
    horizontal = false;
    @property({ visible: false, override: true })
    vertical = true;
    @property({
        type: Component.EventHandler,
        visible: false,
        override: true,
    })
    scrollEvents = [];

    // Increase
    @property(Prefab)
    _cell: Prefab = null!;
    @property({ type: Prefab, tooltip: "Rendering node" })
    get cell() {
        return this._cell;
    }
    set cell(value) {
        if (!EDITOR) {
            this.clear();
            this.cellPool.clear();
        }
        this._cell = value;
    }

    @property({ type: ScrollModel, tooltip: "Sliding direction" })
    get scrollModel() {
        return this.horizontal ? ScrollModel.Horizontal : ScrollModel.Vertical;
    }
    set scrollModel(value) {
        if (!EDITOR) {
            error("[tableView] Do not allow dynamically modified ScrollModel");
            return;
        }
        if (value === ScrollModel.Horizontal) {
            this.horizontal = true;
            this.vertical = false;
        } else {
            this.horizontal = false;
            this.vertical = true;
        }
    }

    // @property({ type: ScrollType, tooltip: 'Single: 单行/单列\nMultiple: 多行/多列' })
    // scrollType: number = ScrollType.Single;

    // @property({ visible: function () { return this.scrollType == ScrollType.Multiple }, tooltip: 'Horizontal: 有几行\Vertical: 有几列' })
    // mulCount: number = 0;

    private cellPool: NodePool = new NodePool("viewCell");
    private cellData = null;
    private cellCount = 0;
    private childCount = 0;

    private startIndex = 0;
    private maxStartIndex = 0;
    private endIndex = 0;

    private anchorCenterX = 0;
    private anchorCenterY = 0;
    private anchorLeftX = 0;
    private anchorTopY = 0;
    private cellAnchorX = 0;
    private cellAnchorY = 0;

    private customSize = false;
    private cellAccumSizes: number[] = [];
    private cellSizes: number[] = [];
    private cellSize: number = 0;

    private updateRefreshOnce = false;
    private updateRefreshForce = false;
    private updateCellsOn = false;
    private updateCellsOnce = false;

    onDestroy() {
        while (this.cellPool.size()) {
            this.cellPool?.get()?.destroy();
        }
    }

    onEnable() {
        this.node.on(
            ScrollView.EventType.SCROLL_BEGAN,
            this.onScrollBegin,
            this
        );
        this.node.on(ScrollView.EventType.SCROLL_ENDED, this.onScrollEnd, this);

        // if (super.onEnable) {
        super.onEnable();
        // }
    }

    onDisable() {
        this.node.off(
            ScrollView.EventType.SCROLL_BEGAN,
            this.onScrollBegin,
            this
        );
        this.node.off(
            ScrollView.EventType.SCROLL_ENDED,
            this.onScrollEnd,
            this
        );

        // if (super.onDisable) {
        super.onDisable();
        // }
    }

    private onScrollBegin() {
        this.updateCellsOn = true;
    }

    private onScrollEnd() {
        this.updateCellsOn = false;
        this.updateCellsOnce = true;
    }

    getCellCount() {
        return this.cellCount;
    }

    setCellCount(num: number) {
        if (typeof num === "number" && num >= 0) {
            this.cellCount = num;
        } else {
            error("[tableView] setCellCount 参数错误");
        }
    }

    getCellData() {
        return this.cellData;
    }

    setCellData(data: any) {
        if (typeof data !== "undefined") {
            this.cellData = data;
        }
    }

    getCellRange() {
        const children: tvCell[] = <tvCell[]>this.content?.children;
        if (children.length == 0) {
            return { min: -1, max: -1 };
        }
        return {
            min: children[0].tvIndex,
            max: children[children.length - 1].tvIndex,
        };
    }

    /**
     * [Real -time operation] If the size of the scrollbar dynamically modified, you need to call this method to update
     */
    refreshScrollBar() {
        // @ts-ignore
        this._updateScrollBar(this._getHowMuchOutOfBoundary());
    }

    /**
     * [Delay operation] Refresh
     * 1. Cell size changes need to be refreshed when the position of Cell
     * 2. After changing the size and the anchor point, you need to refresh the position of the Cell position
     * 3. Cellcount changes, call when you need to refresh cell
     *
     * Calling Refresh does not mean that it will execute the init or uninit method of Cell
     * Only when Cell’s INDEX needs to change due to insertion, deletion, scrolling, initialization, etc.
     */
    refresh(force = true) {
        this.updateRefreshOnce = true;
        if (force) {
            this.updateRefreshForce = true;
        }
    }

    /**
     * [Real -time operation] Refresh
     */
    refreshSync(force = true) {
        this.stopRefresh();
        this.initData();
        this.updateCells(force);
    }

    /**
     * Stop refresh
     */
    private stopRefresh() {
        this.updateRefreshOnce = false;
        this.updateRefreshForce = false;
    }

    /**
     * [Real -time operation] Initialization
     */
    init(num: number, data?: any) {
        if (DEBUG) {
            if (!this.content) {
                return error("[tableView] 请指定content");
            }
            if (!this.cell) {
                return error("[tableView] 请指定cell");
            }
            if (!this.getViewCell()) {
                return error(
                    "[tableView] 请在cell中添加继承自<viewCell>的自定义组件"
                );
            }
        }
        this.clear();

        this.setCellData(data || null);
        this.setCellCount(num);

        this.initData();

        this.stopAutoScroll();
        this.scrollToOrigin();

        this.updateCells(true);
    }

    /**
     *[Real -time operation] Clear empty
     */
    clear() {
        this.cellCount = 0;
        this.childCount = 0;
        this.startIndex = 0;
        this.endIndex = 0;
        this.maxStartIndex = 0;
        this.content &&
            (this.content[this.horizontal ? "width" : "height"] = 0);

        this.stopRefresh();
        this.updateCellCount();
    }

    /**
     * [Real -time operation] heavy load
     */
    reload(start = 0, num?: number) {
        if (typeof num === "undefined") {
            this.content?.children.forEach((cell: Node) => {
                const tvCell = cell as tvCell; // Cast Node to tvCell
                if (tvCell.tvIndex >= start) {
                    this.reloadCell(tvCell);
                }
            });
        } else {
            if (num <= 0) return;

            if (start < 0) start = start + this.cellCount;

            if (start + num < 0) return;

            this.content?.children.forEach((cell: Node) => {
                const tvCell = cell as tvCell; // Cast Node to tvCell
                if (tvCell.tvIndex >= start && tvCell.tvIndex < start + num) {
                    this.reloadCell(tvCell);
                }
            });
        }
    }

    /**
     * [Delay operation] Insert
     */
    insert(start = -1, num = 1, data?: any) {
        if (num <= 0) return;

        if (start < 0) start = start + this.cellCount + 1;
        if (start < 0) start = 0;

        this.setCellData(data);

        const children = this.content?.children || [];
        for (let index = children.length - 1; index >= 0; index--) {
            const node: tvCell = <tvCell>children[index];
            if (node._tvIndex >= start) {
                node._tvIndex += num;
            }
        }

        this.setCellCount(this.cellCount + num);
        this.refresh();
    }

    /**
     * [Late operation] Delete
     */
    remove(start = -1, num = 1, data?: any) {
        if (num <= 0) return;

        if (start < 0) start = start + this.cellCount;
        let end = start + num;

        if (start < 0) {
            start = 0;
        }
        if (end > this.cellCount) {
            end = this.cellCount;
        }

        num = end - start;

        if (start >= this.cellCount || end <= 0 || num < 0 || start >= end)
            return;

        this.setCellData(data);

        const children = this.content?.children || [];
        for (let index = children.length - 1; index >= 0; index--) {
            const node: tvCell = <tvCell>children[index];
            if (node._tvIndex >= start) {
                if (node._tvIndex < end) {
                    node._tvIndex = -1;
                } else {
                    node._tvIndex -= num;
                }
            }
        }

        this.setCellCount(this.cellCount - num);
        this.refresh();
    }

    private getCell(): tvCell {
        let node: tvCell | null = null;
        if (this.cellPool.size()) {
            node = <tvCell>this.cellPool.get();
        } else {
            node = <tvCell>instantiate(this.cell);
        }
        node.tvIndex = -1;
        node._tvIndex = -1;
        return node;
    }

    private putCell(node: tvCell) {
        this.cellPool.put(node);
    }

    private initCell(cell: tvCell, index: number) {
        if (!cell) return;
        if (index >= 0) {
            if (cell.tvIndex != index || cell.tvIndex != cell._tvIndex) {
                const com = cell.getComponent(ViewCell)!;
                if (com) {
                    if (cell.tvIndex >= 0) com.uninit();
                    com.init(index, this.cellData, this);
                }
            }
            cell.tvIndex = index;
            cell._tvIndex = index;
        }
    }

    private uninitCell(cell: tvCell) {
        if (cell.tvIndex >= 0) {
            cell.getComponent(ViewCell)!.uninit();
            cell.tvIndex = -1;
            cell._tvIndex = -1;
        }
    }

    private reloadCell(cell: tvCell) {
        cell.getComponent(ViewCell)!.reload(this.cellData);
    }

    private getViewCell(): viewCell | null {
        if (this.cell) {
            const com = this.cell.data.getComponent("ViewCell");
            if (com) {
                // return <typeof viewCell>js.getClassByName(js.getClassName(com));
                return (
                    com.constructor || js.getClassByName(js.getClassName(com))
                );
            }
        }
        return null;
    }

    /**
     * Get the default cell size
     */
    private getDefaultCellSize() {
        if (this.cell) {
            if (DEBUG && this.cell.data.getComponent(Widget)) {
                warn(
                    "[tableView]Widget is existed in cell root nodes, and may not be able to obtain size correctly"
                );
            }
            return this.cell.data.getContentSize();
        }
        return Size.ZERO;
    }

    /**
     *Get the default cell anchor point
     */
    private getDefaultCellAnchor() {
        if (this.cell) {
            return this.cell.data.getAnchorPoint();
        }
        return Vec2.ZERO;
    }

    private getScrollLengh() {
        const offset = this.getScrollOffset();
        const scrollLen = this.horizontal ? -offset.x : offset.y;

        if (scrollLen < 0) {
            return 0;
        }

        // There is MaxstartIndex as a limit, you can do not restrict here
        // const maxOffset = this.getMaxScrollOffset();
        // const maxScrollLen = this.horizontal ? -maxOffset.x : maxOffset.y;
        // if (scrollLen > maxScrollLen) {
        //     return maxScrollLen;
        // }
        return scrollLen;
    }

    /**
     * Initialized Elimination Value
     */
    private initData() {
        const view = this.getViewCell();
        const defaultCellSize = this.getDefaultCellSize();
        const prop = this.horizontal ? "width" : "height";

        const viewLen = this.content?.parent && this.content?.parent[prop];

        // Whether to define the size
        this.customSize = !!view && !!view.hasOwnProperty("getSize");

        // Initial default data
        this.cellSize = defaultCellSize[prop];
        this.cellAccumSizes.length = 0;
        this.cellSizes.length = 0;
        this.maxStartIndex = 0;
        this.startIndex = 0;
        this.endIndex = 0;

        // Fill in Cell data
        if (this.customSize) {
            /**
             * [Performance Problem] Performance problems may occur here, the reasons may be:
             * 1. View.getsize
             * 2, the amount of data is great
             */
            for (
                let index = 0, accumSize = 0, size = 0;
                index < this.cellCount;
                index++
            ) {
                size = view?.getSize(index, this.cellData) || 0;
                if (!size || size < 0) size = this.cellSize;
                this.cellSizes.push(size);

                accumSize += size;
                this.cellAccumSizes.push(accumSize);
            }
        }

        // Calculate childcount
        if (this.customSize) {
            // Custom CELL is small, childcount needs to be dynamically calculated in real time. Calculate here the childcount when it slides to the bottom
            this.childCount = this.cellCount;

            const accumIndex = this.cellAccumSizes.length - 1;
            const accumSize = this.cellAccumSizes[accumIndex];
            for (let index = 1, size = 0; index <= accumIndex; index++) {
                size = this.cellAccumSizes[accumIndex - index];

                if (accumSize - size >= viewLen) {
                    this.childCount = index + 1;
                    break;
                }
            }
        } else {
            this.childCount = Math.ceil(viewLen / this.cellSize) + 1;
        }

        // Prevent cross -border
        if (this.childCount > this.cellCount) {
            this.childCount = this.cellCount;
        }

        // Calculate the maximum start bidding
        if (this.cellCount > this.childCount) {
            this.maxStartIndex = this.cellCount - this.childCount;
        } else {
            this.maxStartIndex = 0;
        }

        // Calculate content size
        if (this.customSize && this.content) {
            this.content[prop] =
                this.cellAccumSizes[this.cellAccumSizes.length - 1] || 0;
        } else {
            this.content &&
                (this.content[prop] = this.cellSize * this.cellCount);
        }

        // Calculate the basic positioning value
        const cellAnchor = this.getDefaultCellAnchor();
        const uiTransform = this.content?.getComponent(UITransform);
        if (uiTransform) {
            this.anchorCenterX =
                (0.5 - uiTransform.anchorPoint.x) * uiTransform.width;
            this.anchorCenterY =
                (0.5 - uiTransform.anchorPoint.y) * uiTransform.height;
            this.anchorLeftX =
                (0 - uiTransform.anchorPoint.x) * uiTransform.width;
            this.anchorTopY =
                (1 - uiTransform.anchorPoint.y) * uiTransform.height;
            this.cellAnchorX = cellAnchor.x;
            this.cellAnchorY = 1 - cellAnchor.y;
        }
    }

    /**
     * Update the number of cells, not enough to add, delete more
     */
    private updateCellCount() {
        const children: tvCell[] = <tvCell[]>this.content?.children;

        if (children.length == this.childCount) {
            return;
        } else if (children.length > this.childCount) {
            let cell: tvCell | null = null;

            // Prefer to delete Cell that is about to abandon
            for (
                let index = children.length - 1;
                index >= this.childCount;
                index--
            ) {
                cell = children[index];

                if (
                    cell._tvIndex < this.startIndex ||
                    cell._tvIndex > this.endIndex
                ) {
                    this.uninitCell(cell);
                    this.putCell(cell);
                }
            }

            // Delete it from the back
            for (
                let index = children.length - 1;
                index >= this.childCount;
                index--
            ) {
                cell = children[index];

                this.uninitCell(cell);
                this.putCell(cell);
            }
        } else {
            for (
                let index = children.length;
                index < this.childCount;
                index++
            ) {
                this.content?.addChild(this.getCell());
            }
        }
    }

    /**
     * Based on the sliding distance, get StartIndex
     */
    private getStartIndex(scrollLen: number) {
        let startIndex = 0;
        const maxStartIndex = this.maxStartIndex;

        if (this.customSize) {
            const cellAccumSizes = this.cellAccumSizes;
            if (cellAccumSizes.length < 5) {
                // Ordinary cycle
                for (; startIndex < maxStartIndex; startIndex++) {
                    if (cellAccumSizes[startIndex] > scrollLen) {
                        break;
                    }
                }
            } else {
                // 二分查找
                let min = 0,
                    max = maxStartIndex,
                    value = 0;
                while (max >= min) {
                    startIndex = Math.floor((max + min) / 2);
                    value = cellAccumSizes[startIndex];

                    if (scrollLen == value) {
                        if (startIndex < maxStartIndex) startIndex += 1;
                        break;
                    } else if (
                        scrollLen < value &&
                        (startIndex == 0 ||
                            scrollLen >= cellAccumSizes[startIndex - 1])
                    ) {
                        break;
                    } else if (scrollLen > value) {
                        min = startIndex + 1;
                    } else {
                        max = startIndex - 1;
                    }
                }
            }
        } else {
            startIndex = Math.floor(scrollLen / this.cellSize);
            if (startIndex < 0) {
                startIndex = 0;
            } else if (startIndex > maxStartIndex) {
                startIndex = maxStartIndex;
            }
        }

        return startIndex;
    }

    /**
     * Update starting, ending, childnum (only custom CLL size will be updated)
     */
    private updateCellRange() {
        // Rolling distance
        const scrollLen = this.getScrollLengh();

        // The start of the current rolling distance corresponding to the benchmark
        this.startIndex = this.getStartIndex(scrollLen);
        // Custom CELL size needs to be updated by childcount
        if (this.customSize) {
            const viewLen =
                this.content?.parent &&
                this.content.parent[this.horizontal ? "width" : "height"];
            const cellAccumLen = this.cellAccumSizes.length;
            // Is the number of decimals compared here, will 0.1+0.2! = 0.3?
            if (this.cellAccumSizes[cellAccumLen - 1] - viewLen <= scrollLen) {
                this.childCount = cellAccumLen - this.startIndex;
            } else {
                const startSize = this.cellAccumSizes[this.startIndex];

                for (
                    let endIndex = this.startIndex + 1, accumSize = 0;
                    endIndex < cellAccumLen;
                    endIndex++
                ) {
                    accumSize = this.cellAccumSizes[endIndex];

                    // Is the number of decimals compared here, will 0.1+0.2! = 0.3?
                    if (accumSize - viewLen >= scrollLen) {
                        if (accumSize - startSize >= viewLen) {
                            this.childCount = endIndex - this.startIndex + 1;
                        } else {
                            this.childCount = endIndex - this.startIndex + 2;
                        }
                        break;
                    }
                }
            }
        }

        // The termination of the current rolling distance corresponding to CELL settlement
        this.endIndex = this.startIndex + this.childCount - 1;
    }

    /**
     *Update Cell status
     */
    private updateCell(cell: tvCell, index?: number) {
        if (!cell) return;
        if (typeof index === "number") {
            this.initCell(cell, index);
        } else {
            this.initCell(cell, cell._tvIndex);
            index = cell.tvIndex;
        }

        if (this.horizontal) {
            if (this.customSize) {
                cell.setPosition(
                    new Vec3(
                        this.anchorLeftX -
                            this.cellSizes[index] * this.cellAnchorX +
                            this.cellAccumSizes[index],
                        cell.position.y,
                        cell.position.z
                    )
                );
            } else {
                cell.setPosition(
                    new Vec3(
                        this.anchorLeftX -
                            this.cellSize * this.cellAnchorX +
                            this.cellSize * (index + 1),
                        cell.position.y,
                        cell.position.z
                    )
                );
            }
            cell.setPosition(
                new Vec3(cell.position.x, this.anchorCenterY, cell.position.z)
            );
        } else {
            if (this.customSize) {
                cell.setPosition(
                    new Vec3(
                        cell.position.x,
                        this.anchorTopY +
                            this.cellSizes[index] * this.cellAnchorY -
                            this.cellAccumSizes[index],
                        cell.position.z
                    )
                );
            } else {
                cell.setPosition(
                    new Vec3(
                        cell.position.x,
                        this.anchorTopY +
                            this.cellSize * this.cellAnchorY -
                            this.cellSize * (index + 1),
                        cell.position.z
                    )
                );
            }
            cell.setPosition(
                new Vec3(this.anchorCenterX, cell.position.y, cell.position.z)
            );
        }
    }

    /**
     * Update Cells status
     *
     * Based on StartIndex and EndIndex, the nodes under Content are divided into KeepCells and Changecells
     * 1. Uniformly update the coordinates of Cells in KeepCells and CHANGECELLS
     * 2, Cell in Changecells will be initinit
     */
    private updateCells(force = false) {
        this.updateCellsOnce = false;

        this.updateCellRange();
        this.updateCellCount();

        if (!this.childCount) {
            return;
        }

        const startIndex = this.startIndex;
        const endIndex = this.endIndex;

        const children: tvCell[] = <tvCell[]>this.content?.children;

        // Under normal slide, as long as the first Cell's _tvindex is equal to the last cell _tvindex and endindex of the last cell, there is no need to perform the next step calculation
        // If it is in other cases, the next calculation must be performed.
        if (
            !force &&
            children[0]._tvIndex == startIndex &&
            children[children.length - 1]._tvIndex == endIndex
        ) {
            return;
        }

        const keepCells: tvCell[] = [];
        const changeCells: tvCell[] = [];
        children.forEach((cell) => {
            if (
                cell._tvIndex < startIndex ||
                cell._tvIndex > endIndex ||
                cell._tvIndex != cell.tvIndex
            ) {
                this.uninitCell(cell);
                changeCells.push(cell);
            } else {
                keepCells.push(cell);
            }
        });

        // No refresh
        if (changeCells.length == 0) {
            if (force) children.forEach((cell) => this.updateCell(cell));
        }
        // All cell needs to be refreshed
        else if (keepCells.length == 0) {
            children.forEach((cell, index) =>
                this.updateCell(cell, startIndex + index)
            );
        }
        // Only some cells need to refresh
        else {
            for (
                let index = startIndex, keepPoint = 0, changePoint = 0, i = 0;
                index <= endIndex;
                index++, i++
            ) {
                if (
                    keepPoint < keepCells.length &&
                    index == keepCells[keepPoint]._tvIndex
                ) {
                    this.updateCell(keepCells[keepPoint++]);
                } else {
                    this.updateCell(changeCells[changePoint++], index);
                }
            }
        }

        // Sort
        children.forEach(function (node) {
            node.setSiblingIndex(node.tvIndex - startIndex);
        });
        // this.content.sortAllChildren();
    }

    scrollToIndex(index?: number, timeInSecond?: number, attenuated?: boolean) {
        // todo
        console.log("[tableView] scrollToIndex");
    }

    getPerScrollOffset() {
        if (this.horizontal) {
            return v2(
                this.getScrollOffset().x / this.getMaxScrollOffset().x,
                0
            );
        } else {
            return v2(
                0,
                this.getScrollOffset().y / this.getMaxScrollOffset().y
            );
        }
    }

    scrollToPerOffset(
        offset: Vec2,
        timeInSecond?: number,
        attenuated?: boolean
    ) {
        if (this.horizontal) {
            offset.x *= this.getMaxScrollOffset().x;
        } else {
            offset.y *= this.getMaxScrollOffset().y;
        }
        this.scrollToOffset(offset, timeInSecond, attenuated);
    }

    scrollToOrigin(timeInSecond?: number, attenuated?: boolean) {
        if (this.horizontal) {
            this.scrollToLeft(timeInSecond, attenuated);
        } else {
            this.scrollToTop(timeInSecond, attenuated);
        }
    }

    stopAutoScroll() {
        if (!this.updateCellsOnce && this.updateCellsOn) {
            this.updateCellsOnce = true;
        }
        super.stopAutoScroll();
    }

    scrollToBottom(timeInSecond?: number, attenuated?: boolean) {
        if (timeInSecond) {
            this.updateCellsOn = true;
        } else {
            this.updateCellsOnce = true;
        }
        super.scrollToBottom(timeInSecond, attenuated);
    }

    scrollToTop(timeInSecond?: number, attenuated?: boolean) {
        if (timeInSecond) {
            this.updateCellsOn = true;
        } else {
            this.updateCellsOnce = true;
        }
        super.scrollToTop(timeInSecond, attenuated);
    }

    scrollToLeft(timeInSecond?: number, attenuated?: boolean) {
        if (timeInSecond) {
            this.updateCellsOn = true;
        } else {
            this.updateCellsOnce = true;
        }
        super.scrollToLeft(timeInSecond, attenuated);
    }

    scrollToRight(timeInSecond?: number, attenuated?: boolean) {
        if (timeInSecond) {
            this.updateCellsOn = true;
        } else {
            this.updateCellsOnce = true;
        }
        super.scrollToRight(timeInSecond, attenuated);
    }

    scrollToOffset(offset: Vec2, timeInSecond?: number, attenuated?: boolean) {
        if (timeInSecond) {
            this.updateCellsOn = true;
        } else {
            this.updateCellsOnce = true;
        }
        super.scrollToOffset(offset, timeInSecond, attenuated);
    }

    update(dt) {
        super.update(dt);
        if (this.updateRefreshOnce) this.refreshSync(this.updateRefreshForce);
        if (this.updateCellsOn || this.updateCellsOnce) this.updateCells();
    }
}
