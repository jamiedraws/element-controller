/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "../shared/ts/patterns/pubsub.ts":
/*!***************************************!*\
  !*** ../shared/ts/patterns/pubsub.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ PubSub; }
/* harmony export */ });
class PubSub {
  /**
   * Represents the relationship between the PubSub instance and the id that is used to generate unique tokens
   */

  /**
   * Represents the relationship between the PubSub instance and the IPubSubEvents object
   */

  /**
   * A publish/subscribe, pub-sub, interface that enables the ability to subscribe multiple different tasks to a common event name, the ability to publish different data to all subscribers of the common event name, and the ability to unsubscribe from a common event name.
   */
  constructor() {
    PubSub.id.set(this, -1);
    PubSub.events.set(this, {});
  }

  /**
   * Takes the event name along with any data and publishes the data to all of the subscribers. Returns true if the publish operation was successful; otherwise, returns false.
   * @param event string
   * @param record MutationRecord
   * @returns boolean
   */
  publish(event, data) {
    const events = PubSub.events.get(this);
    if (!events) {
      return false;
    }
    if (!events[event]) {
      return false;
    }
    const subscribers = events[event];
    subscribers.forEach(function (subscriber) {
      subscriber.task(data);
    });
    return true;
  }

  /**
   * Uses an event name and a callback function to make a subscription. In turn, calling the publish method on this event name will execute the callback function. A unique token is returned that can be used to unsubscribe from the system.
   * @param event string
   * @param task PubSubTask
   * @returns string
   */
  subscribe(event, task) {
    let token = "";
    let id = PubSub.id.get(this);
    const events = PubSub.events.get(this);
    if (events && id !== undefined) {
      if (!events[event]) {
        events[event] = [];
      }
      if (id !== undefined) {
        PubSub.id.set(this, id += 1);
        token = id.toString();
        events[event].push({
          token: token,
          task: task
        });
      }
    }
    return token;
  }

  /**
   * Uses a unique token to unsubscribe a callback function from an event name. The token is returned if the unsubscription operation is successful; otherwise, null is returned.
   * @param token string
   * @returns string
   */
  unsubscribe(token) {
    let found = false;
    const events = PubSub.events.get(this);
    if (events) {
      found = Object.keys(events).some(event => {
        return events[event].some((subscriber, index) => {
          const areEqual = subscriber.token === token.toString();
          if (areEqual) {
            events[event].splice(index, 1);
          }
          return areEqual;
        });
      });
    }
    return found ? token : undefined;
  }
}
PubSub.id = new WeakMap();
PubSub.events = new WeakMap();

/***/ }),

/***/ "../shared/ts/utils/capture-element.ts":
/*!*********************************************!*\
  !*** ../shared/ts/utils/capture-element.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ CaptureElement; }
/* harmony export */ });
/* harmony import */ var Shared_ts_patterns_pubsub__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! Shared/ts/patterns/pubsub */ "../shared/ts/patterns/pubsub.ts");

class CaptureElement {
  /**
   * Represents the element that will be registered to a new MutationObserver instance
   */

  /**
   * Represents the relationship between the CaptureElement instance and the MutationObserver instance
   */

  /**
   * Represents the relationship between the CaptureElement instance and the PubSub instance
   */

  /**
   * CaptureElement is a publish/subscribe, pub-sub, interface that can be controlled by an element that is registered to a new MutationObserver instance. Subscription names are mapped to the Mutation Observer's observable types that are defined in the MutationObserverInit dictionary. When an observable type is captured on the element, a callback function will be executed back to the author where the MutationRecord information can be accessed.
   * @param element Element
   */
  constructor(element) {
    this.element = void 0;
    this.element = element;
    const pubsub = new Shared_ts_patterns_pubsub__WEBPACK_IMPORTED_MODULE_0__["default"]();
    const observer = CaptureElement.createObserver(element, records => {
      records.forEach(record => {
        switch (record.type) {
          case "characterData":
            pubsub.publish("characterData", record);
            break;
          case "attributes":
            pubsub.publish("attributes", record);
            break;
          case "childList":
            pubsub.publish("childList", record);
            break;
        }
      });
    });
    CaptureElement.pubsub.set(this, pubsub);
    CaptureElement.observers.set(this, observer);
  }

  /**
   * Takes the element along with the callback function and returns the new MutationObserver object
   * @param element Element
   * @param callback MutationCallback
   * @returns MutationObserver
   */
  static createObserver(element, callback) {
    const observer = new MutationObserver(callback);
    observer.observe(element, {
      subtree: true,
      childList: true,
      attributes: true,
      characterData: true
    });
    return observer;
  }

  /**
   * Uses an event name and a callback function to make a subscription. In turn, calling the publish method on this event name will execute the callback function. A unique token is returned that can be used to unsubscribe from the system.
   * @param event CaputerElementEventName
   * @param task CaptureElementTask
   * @returns string
   */
  subscribe(event, task) {
    const pubsub = CaptureElement.pubsub.get(this);
    return pubsub?.subscribe(event, task);
  }

  /**
   * Uses a unique token to unsubscribe a callback function from an event name. The token is returned if the unsubscription operation is successful; otherwise, null is returned.
   * @param token string
   * @returns string
   */
  unsubscribe(token) {
    const pubsub = CaptureElement.pubsub.get(this);
    return pubsub?.unsubscribe(token);
  }

  /**
   * Closes the connection to the element's MutationObserver
   */
  disconnect() {
    const observer = CaptureElement.observers.get(this);
    observer?.disconnect();
  }

  /**
   * Opens the connection to the element's MutationObserver
   */
  connect() {
    const observer = CaptureElement.observers.get(this);
    observer?.observe(this.element, {
      subtree: true,
      childList: true,
      attributes: true,
      characterData: true
    });
  }
}
CaptureElement.observers = new WeakMap();
CaptureElement.pubsub = new WeakMap();

/***/ }),

/***/ "../shared/ts/utils/element-controller.ts":
/*!************************************************!*\
  !*** ../shared/ts/utils/element-controller.ts ***!
  \************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ ElementController; }
/* harmony export */ });
/* harmony import */ var Shared_ts_utils_capture_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! Shared/ts/utils/capture-element */ "../shared/ts/utils/capture-element.ts");

class ElementController {
  /**
   * Represents the root that will contain all elements and controllers as descedent elements
   */

  /**
   * Represents an array of controller elements where each controller is responsible for managing the state of the elements through the `aria-controls` attribute
   */

  /**
   * Represents an array of elements where each element can be controlled by a controller element through the `id` attribute
   */

  /**
   * Enables the ability for controller elements that are equipped with the `aria-controls` attribute to control the state of other elements by a reference to it's `id` attribute.
   * @param root Element | null | undefined
   */
  constructor(root) {
    this.root = void 0;
    this.controllers = [];
    this.elements = void 0;
    this.root = root ?? document.querySelector(".element-controller");
    if (!this.root?.classList.contains("element-controller")) {
      this.root?.classList.add("element-controller");
    }
    if (this.root) {
      this.controllers = Array.from(this.root.querySelectorAll("[aria-controls]")).filter(controller => controller.closest(".element-controller") === this.root);
    }
    this.elements = [];
    ElementController.initialize(this);
  }

  /**
   * Initializes the process
   * @param context ElementController
   */
  static initialize(context) {
    this.setElementsByContext(context);
    if (context.root) {
      const captureElement = new Shared_ts_utils_capture_element__WEBPACK_IMPORTED_MODULE_0__["default"](context.root);
      captureElement.subscribe("attributes", record => {
        if (record.attributeName === "aria-controls") {
          this.setElementsByContext(context);
        }
        const controller = context.controllers.find(controller => controller === record.target);
        if (!controller) return;
        if (record.attributeName === ElementController.getControllerExpandedAttribute(controller)) {
          context.initializeController(context, controller);
        }
      });
    }
    this.initializeControllers(context);
  }

  /**
   * Initializes all controllers
   * @param context ElementController
   */
  static initializeControllers(context) {
    context.controllers.forEach(controller => {
      context.initializeController(context, controller);
      context.isControllerExpanded(controller) ? context.addControllerState(controller) : context.removeControllerState(controller);
    });
  }

  /**
   * Initializes a controller
   * @param context ElementController
   * @param controller Element
   */
  initializeController(context, controller) {
    const relatedElements = context.getRelatedElementsByController(controller);
    const unrelatedElements = context.getUnrelatedElementsByController(controller);
    const isExpanded = context.isControllerExpanded(controller);
    if (isExpanded) {
      ElementController.updateControllerStatesByContext(context, controller);
      ElementController.addElementStateByElements(relatedElements, controller);
      ElementController.removeElementStateByElements(unrelatedElements);
    }
  }

  /**
   * Iterates through an array of elements and assigns the controller `id` as a value to the `data-element-controller-name` attribute, then sets the `aria-hidden` attribute to `false`
   * @param elements (Element | undefined | null)[]
   * @param controller Element
   */
  static addElementStateByElements(elements, controller) {
    elements.forEach(element => {
      element?.setAttribute("data-element-controller-name", controller.id);
      element?.setAttribute("aria-hidden", "false");
    });
  }

  /**
   * Takes the controller and sets the `aria-expanded` attribute to `true`
   * @param controller Element
   */
  addControllerState(controller) {
    controller.setAttribute(ElementController.getControllerExpandedAttribute(controller), "true");
  }

  /**
   * Takes the controller and sets the `aria-expanded` attribute to `false`
   * @param controller Element
   */
  removeControllerState(controller) {
    controller.setAttribute(ElementController.getControllerExpandedAttribute(controller), "false");
  }
  static getControllerExpandedAttribute(controller) {
    return ElementController.isControllerRoleCheckboxOrRadio(controller) ? "aria-checked" : "aria-expanded";
  }
  static isControllerRoleCheckboxOrRadio(controller) {
    const isInput = controller.nodeName.toLowerCase() === "input";
    const type = (controller.getAttribute("type") ?? "").toLowerCase();
    return isInput && (type === "checkbox" || type === "radio");
  }

  /**
   * Iterates through an array of elements and removes the `data-element-controller-name` attribute and sets the `aria-hidden` attribute to `true`
   * @param elements (Element | undefined | null)[]
   */
  static removeElementStateByElements(elements) {
    elements.forEach(element => {
      element?.removeAttribute("data-element-controller-name");
      element?.setAttribute("aria-hidden", "true");
    });
  }

  /**
   * Iterates through all controllers and attempts to capture and store all matching elements that can be controlled
   * @param context ElementController
   */
  static setElementsByContext(context) {
    context.controllers.forEach(controller => {
      const elements = this.getContainersByControllerIds(context.getIdsByController(controller), controller, context);
      elements.forEach(element => {
        if (!context.elements.includes(element)) {
          context.elements.push(element);
        }
      });
    });
  }

  /**
   * Iterates through an array of id values and attempts to capture the DOM element by that id and returns each element into a new element array. If an element cannot be found in the document, an error message will be reported to the browser console informing the developer of a mismatch.
   * @param ids string[]
   * @param controller Element
   * @param context ElementController
   * @returns Element[]
   */
  static getContainersByControllerIds(ids, controller, context) {
    const filterIds = ids.filter(id => id !== "");
    return Array.from(filterIds, id => {
      const element = context.getElementById(id) ?? context.root?.querySelector(`#${id}`);
      if (!element) {
        console.error({
          message: `The element id, ${id}, referenced within the current controller could not be found in the document.`,
          controller
        });
      }
      return element;
    });
  }

  /**
   * Filters out all controllers from the controller context and sets the `aria-expanded` state to `false`.
   * @param context ElementController
   * @param controllerContext Element
   */
  static updateControllerStatesByContext(context, controllerContext) {
    context.controllers.filter(controller => controller !== controllerContext).forEach(controller => controller.setAttribute(this.getControllerExpandedAttribute(controller), "false"));
  }

  /**
   * Determines if the controller is expanded through the `aria-expanded` attribute
   * @param controller Element
   * @returns boolean
   */
  isControllerExpanded(controller) {
    return controller.getAttribute(ElementController.getControllerExpandedAttribute(controller)) === "true";
  }

  /**
   * Returns a new array of elements that are related to the id list referenced by the controller
   * @param controller Element
   * @returns (Element | undefined | null)[]
   */
  getRelatedElementsByController(controller) {
    const ids = this.getIdsByController(controller);
    return this.elements.filter(element => ids.includes(element?.id ?? ""));
  }

  /**
   * Returns a new array of elements that aren't related to the id list referenced by the controller
   * @param controller Element
   * @returns (Element | undefined | null)[]
   */
  getUnrelatedElementsByController(controller) {
    const ids = this.getIdsByController(controller);
    return this.elements.filter(element => !ids.includes(element?.id ?? ""));
  }

  /**
   * Takes a controller element and returns a string array of all id references
   * @param controller Element
   * @returns string[]
   */
  getIdsByController(controller) {
    return (controller.getAttribute("aria-controls") ?? "").split(" ");
  }

  /**
   * Returns a matching element from the elements array by a given id
   * @param id string
   * @returns Element
   */
  getElementById(id) {
    return this.elements.find(element => element?.id === id);
  }

  /**
   * Takes a controller element, adds the controller state and updates the elements on the view
   * @param controller Element
   */
  toggleElementsByController(controller) {
    this.addControllerState(controller);
  }
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
/*!*******************!*\
  !*** ./js/app.ts ***!
  \*******************/
/* harmony import */ var Shared_ts_utils_element_controller__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! Shared/ts/utils/element-controller */ "../shared/ts/utils/element-controller.ts");
// utils

var elementController = new Shared_ts_utils_element_controller__WEBPACK_IMPORTED_MODULE_0__["default"]();
elementController.controllers.forEach(function (controller) {
    controller.addEventListener("click", function (event) {
        elementController.toggleElementsByController(controller);
    });
});

}();
/******/ })()
;
//# sourceMappingURL=app.es5.js.map