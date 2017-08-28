/**
 * Created by tdzl2003 on 03/06/2017.
 */

export default class BaseViewManager {
  constructor(bridge) {
    this.bridge = bridge;

    if (this.__domDirectEvent) {
      // Copy from prototype.
      this.__props = {...this._props};
      for (const name of Object.keys(this.__domDirectEvent)) {
        const [ eventName, eventWrapper ] = this.__domDirectEvent[name];
        const eventHandler = (ev) => {
          const tag = ev.target.getAttribute('data-react-id') | 0;
          bridge.sendEvent(tag, name, eventWrapper(ev))
        };

        const setter = function (view, value) {
          if (value) {
            view.addEventListener(eventName, eventHandler);
          } else {
            view.removeEventListener(eventName, eventHandler);
          }
        };

        this.__props[name] = setter;
      }
    }
  }

  setViewTag(view, tag) {
    view.setAttribute('data-react-id', tag);
  }

  setChildren(view, children) {
    // TODO: Optimize me.
    while (view.lastChild) {
      view.removeChild(view.lastChild);
    }

    for (const child of children) {
      view.appendChild(child);
    }
  }

  setViewProps(view, props) {
    for (const key of Object.keys(props)) {
      if (this.__styles && this.__styles[key]) {
        this.__styles[key](view, props[key]);
      } else if (this.__props && this.__props[key]) {
        this.__props[key](view, props[key]);
      }
    }
  }

  manageChildren(view, moveFrom, moveTo, addChildren, addAtIndecies, removeFrom) {
    const startChildren = [...view.children];
    const finallyRemoves = [];

    if (moveFrom) {
      addChildren = addChildren || [];
      addAtIndecies = addAtIndecies || [];
      for (let i = 0; i < moveFrom.length; i++) {
        const viewToMove = startChildren[moveFrom[i]];
        viewToMove.parentNode.removeChild(viewToMove);
        startChildren[i] = null;
        addChildren.append(viewToMove);
        addAtIndecies.append(moveTo[i]);
      }
    }

    if (removeFrom) {
      for (const i of removeFrom) {
        const viewToRemove = startChildren[i];
        viewToRemove.parentNode.removeChild(viewToRemove);
        startChildren[i] = null;
        finallyRemoves.push(viewToRemove.getAttribute('data-react-id') | 0);
      }
    }

    if (addAtIndecies) {
      const afterRemove = startChildren.filter(v => v);

      const sortedIndex = [];
      for (let i = 0; i < addAtIndecies.length; i++) {
        sortedIndex.push(i);
      }

      sortedIndex.sort((a, b) => addAtIndecies[a] - addAtIndecies[b]);
      for (let i = 0; i < addAtIndecies.length; i++) {
        const id = sortedIndex[i];
        const child = addChildren[id];
        const targetId = addAtIndecies[id] - i;  // i views already inserted before.
        const insertBefore = afterRemove[targetId];
        if (insertBefore) {
          view.insertBefore(child, insertBefore);
        } else {
          view.appendChild(child);
        }
      }
    }
    return finallyRemoves;
  }

  beforeRemoveView(view) {
  }
}
