// utils
import ElementController from "Shared/ts/utils/element-controller";

const elementController = new ElementController();

elementController.controllers.forEach((controller) => {
    controller.addEventListener("click", (event) => {
        elementController.toggleElementsByController(controller);
    });
});
