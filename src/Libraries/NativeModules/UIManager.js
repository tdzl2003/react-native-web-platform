/**
 * Created by tdzl2003 on 03/06/2017.
 */

import { reactMethod, reactPromiseMethod, reactModule } from './decorators';
import { nativeComponentClasses } from '../NativeComponents/decorators';
import RootViewManager from "../NativeComponents/RootViewManager";

const DEBUG = false;

const ROOT_VIEW_TAG_INCREMENT = 10;

@reactModule('UIManager')
export default class UIManager {
  bridge = null;

  viewRegistry = [];
  viewCounter = 0;

  nextRootViewTag = 1;

  viewManagers = {};

  rootViewManager;

  constructor(bridge) {
    this.bridge = bridge;
    this.rootViewManager = new RootViewManager(bridge);
    bridge.uiManager = this;

    const customBubblingEventTypes = {};
    const customDirectEventTypes = {};
    const nativeComponentsInfo = {
      customBubblingEventTypes, customDirectEventTypes,
    };

    for (const clazz of nativeComponentClasses) {
      const name = clazz.__nativeComponentName;
      const instance = this.viewManagers[name] = new clazz(bridge);
      nativeComponentsInfo[name] = {
        NativeProps: instance.__nativeProps || {},
        Commands: instance.__commands || {},
      };
      if (instance.__customBubblingEventTypes) {
        Object.assign(customBubblingEventTypes, instance.__customBubblingEventTypes);
      }
      if (instance.__customDirectEventTypes) {
        Object.assign(customDirectEventTypes, instance.__customDirectEventTypes);
      }
    }

    this.constants = nativeComponentsInfo;
  }

  registerRootView(rootView) {
    const tag = this.nextRootViewTag;
    this.nextRootViewTag += ROOT_VIEW_TAG_INCREMENT;
    this.viewRegistry[tag] = [rootView, this.rootViewManager];
    rootView.setAttribute('data-react-id', tag);
    rootView.setAttribute('data-react-root', true);
    return tag;
  }

  createRootView(container, props) {
    const view = this.rootViewManager.createView();
    const tag = this.nextRootViewTag;
    this.nextRootViewTag += ROOT_VIEW_TAG_INCREMENT;
    this.rootViewManager.setViewTag(view, tag);
    if (props) {
      this.rootViewManager.setViewProps(view, props);
    }
    this.viewRegistry[tag] = [view, this.rootViewManager];
    container.appendChild(view);
    return tag;
  }

  @reactMethod
  createView(tag, className, rootViewTag, props) {
    if (DEBUG) {
      console.log('createView', tag, className, rootViewTag, props);
    }
    const manager = this.viewManagers[className];
    if (!manager) {
      throw new Error(`Native component ${className} was not implemented yet.`);
    }
    const view = manager.createView();
    const payload = manager.createPayload(view);
    manager.setViewTag(view, tag);
    if (props) {
      manager.setViewProps(view, props, payload);
    }
    this.viewRegistry[tag] = [
      view,
      manager,
      payload,
    ];
  }

  @reactMethod
  setChildren(viewTag, childrenTags) {
    if (DEBUG) {
      console.log('setChildren', viewTag, childrenTags);
    }
    const [ view, manager, payload ] = this.viewRegistry[viewTag];

    manager.setChildren(view, childrenTags.map(tag=>this.viewRegistry[tag][0]), payload);
  }

  @reactMethod
  updateView (tag, className, props) {
    if (DEBUG) {
      console.log('updateView', tag, props);
    }
    const [ view, manager, payload ] = this.viewRegistry[tag];
    manager.setViewProps(view, props, payload);
  }

  @reactMethod
  manageChildren(tag, moveFrom, moveTo, addChildTags, addAtIndices, removeFrom) {
    if (DEBUG) {
      console.log('manageChildren', ...arguments);
    }
    const [ view, manager, payload ] = this.viewRegistry[tag];
    const removes = manager.manageChildren(
      view, moveFrom, moveTo,
      addChildTags && addChildTags.map(v=>this.viewRegistry[v][0]),
      addAtIndices,
      removeFrom,
      payload
    );
    for (const removeTag of removes) {
      const [ removeView, removeManager ] = this.viewRegistry[removeTag];
      removeManager.beforeRemoveView(removeView);
      delete this.viewRegistry[removeTag];
    }
  }

  @reactMethod
  measure(tag, cb){
    const [ view, manager ] = this.viewRegistry[tag];
    this.bridge.invoke(cb, {
      left: view.offsetLeft,
      top: view.offsetTop,
      width: view.offsetWidth,
      height: view.offsetHeight,
    });
  }

  @reactMethod
  dispatchViewManagerCommand(tag, name, args){
    const [ view, manager, payload ] = this.viewRegistry[tag];
    manager[name](view, payload, ...args);
  }

  @reactMethod
  setJSResponder() {

  }

  @reactMethod
  clearJSResponder() {

  }

  @reactMethod
  replaceExistingNonRootView(oldTag, newTag) {
    const [ view, manager, payload ] = this.viewRegistry[oldTag];

    const parentTag = manager.getParentTag(view);

    const [ parentView, parentManager, parentPayload ] = this.viewRegistry[parentTag];

    const oldIndex = parentManager.getChildIndex(parentView, oldTag, view);

    this.manageChildren(parentTag, null, null, [newTag], [oldIndex], [oldIndex]);
  }
}
