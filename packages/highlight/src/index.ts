import pointListTpl from "./template/point-list.art";
import "./style/index.scss";
import { EventManager, getBoundingClientRect, isArray } from "@lin-media/utils";
import { HighlightList, HighlightOptions } from "./types";
import MediaPlayer from "@lin-media/player";
import { HighlightEvents } from "./config/event";
import { pluginName } from "./config/constant";

const defaultOptions = {
  jump: true,
  showTip: true
};

class Highlight {
  // 自定义事件
  static customEvents = HighlightEvents;
  // 插件名称.
  static pluginName = pluginName;
  // 播放器的dom
  private el: HTMLElement;
  // 播放器实例
  private instance: MediaPlayer;
  // 是否正在加载标志位
  private load = true;
  // 提示点的dom元素
  private element: HTMLElement | null;
  // 事件管理器
  private eventManager: EventManager | null;
  // 提示点参数
  private options: HighlightOptions;

  constructor(el: HTMLElement, instance: MediaPlayer) {
    // 保存一下播放器给来的参数
    this.el = el;
    this.instance = instance;
    // 合并默认参数
    const options = this.instance.options[pluginName] ?? {};
    this.options = { ...defaultOptions, ...options };
    this.initVar();
    // 开始初始化
    this.init();
    this.initInstanceListener();
    // 挂载方法给外部用
    this.initMethods();
  }

  private initMethods() {
    Object.defineProperty(this.instance, "highlight", {
      get: () => {
        return {
          set: (list: HighlightList) => {
            this.setHighlight(list);
          },
          destroy: () => {
            this.destroyHighlight();
          }
        };
      }
    });
  }

  private initVar() {
    this.eventManager = new EventManager();
  }

  private get duration() {
    return this.instance.duration;
  }

  private initInstanceListener() {
    // 销毁
    this.instance.$on(MediaPlayer.PlayerEvents.DESTROY, () => {
      this.destroyHighlight();
    });
  }

  // 初始化
  private init() {
    // 提示点需要获取总时长，计算出提示点的位置
    if (this.duration && this.duration > 0) {
      // 总时长存在并且大于0，说明视频已经加载好了
      this.load = true;
      this.initElement();
    } else {
      // 获取不到总时长说明视频没有加载完成，需要等待加载完成在执行下一步操作
      this.instance.$once(MediaPlayer.VideoEvents.LOADEDMETADATA, () => {
        this.load = true;
        this.initElement();
      });
    }
  }

  private initElement() {
    const highlightList = this.options.list;
    if (!this.load || !isArray(highlightList) || highlightList.length === 0) {
      // 视频没加载完成或者提示点列表为空不做任何操作
      return;
    }
    // 为防止重复设置,每次设置需要销毁上一次的
    this.removeElementAndListener();
    // 找到进度条的dom元素
    const progressBar = this.el.querySelector(".player-process-content");
    // 开始渲染提示点列表
    const div = document.createElement("div");
    div.innerHTML = pointListTpl({
      highlightList,
      duration: this.duration
    });
    // 保存渲染出来的提示点元素
    this.element = div;
    // 插入到进度条中
    progressBar?.appendChild(div);
    // 事件监听
    this.initListener();
    // 调整位置，有些在最右边或者最左边的可能会被隐藏掉
    this.adjustPosition();
  }
  // 调整位置
  private adjustPosition() {
    const pointListElement = this.element!.querySelectorAll(
      ".highlight-point-tip"
    );
    const { left, right } = getBoundingClientRect(this.el);
    this.adjustLeft(pointListElement, left);
    this.adjustRight(pointListElement, right);
  }

  // 调整左边的距离
  private adjustLeft(pointListElement: NodeListOf<Element>, left: number) {
    const length = pointListElement.length;
    for (let i = 0; i < length; i++) {
      const element = pointListElement[i] as HTMLElement;
      const clientRect = getBoundingClientRect(element);
      if (left > clientRect.left) {
        // 容器距离页面左边的距离大于元素距离页面左边的距离，说明元素被遮挡住了，需要调整一下
        const parentLeft =
          getBoundingClientRect(element.parentElement).left ?? 0;
        const offsetLeft = parentLeft - left;
        element.style.left = `${-offsetLeft}px`;
        element.style.transform = "translate(0,-100%)";
      } else {
        // 找到一个不被遮挡的元素就不用遍历后面的了
        break;
      }
    }
  }

  // 调整右边距离
  private adjustRight(pointListElement: NodeListOf<Element>, right: number) {
    const length = pointListElement.length;
    for (let i = length - 1; i >= 0; i--) {
      const element = pointListElement[i] as HTMLElement;
      const clientRect = getBoundingClientRect(element);
      if (right < clientRect.right) {
        const parentRight =
          getBoundingClientRect(element.parentElement).right ?? 0;
        const offsetRight = right - parentRight;
        element.style.left = `${offsetRight}px`;
        element.style.transform = "translate(-100%,-100%)";
      } else {
        // 找到一个不被遮挡的元素就不用遍历前面的了
        break;
      }
    }
  }

  private initListener() {
    // 事件委托，不要去监听单个元素的
    this.eventManager?.addEventListener({
      element: this.element,
      eventName: "click",
      handler: this.onClick.bind(this)
    });
  }

  private onClick(event: MouseEvent) {
    const { jump, showTip } = this.options;
    const target = event.target as HTMLElement;
    const dataset = target.dataset;

    if (dataset && dataset.index) {
      // 点击的是提示点
      const highlightList = this.options.list as HighlightList;
      const item = highlightList[dataset.index as any];

      if (jump) {
        // 跳转
        this.instance.seek(item.time);
      }
      if (showTip) {
        // 显示提示
        this.instance.setNotice(item.text);
      }
      // 发射自定义事件
      this.instance.$emit(HighlightEvents.HIGHLIGHTCLICK, item);
    }
  }

  private removeElementAndListener() {
    this.eventManager?.removeEventListener();
    this.element?.remove();
    (this.element as any) = null;
  }

  // 设置提示点列表
  setHighlight(list: HighlightList) {
    this.options.list = list;
    this.initElement();
  }

  // 销毁提示点列表
  destroyHighlight() {
    this.options.list = [];
    this.removeElementAndListener();
  }
}

export default Highlight;
