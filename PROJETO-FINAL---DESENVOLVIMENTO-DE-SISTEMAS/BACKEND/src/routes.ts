import { Router } from "express";
import multer from "multer";
import "express-async-errors";

import { isAuthenticated } from "./middlewares/isAuthenticated";
import uploadConfig from "./config/multer";

// -------------------- USER --------------------
import { CreateUserController } from "./controllers/user/CreateUserController";
import { AuthUserController } from "./controllers/user/AuthUserController";
import { DetailUserController } from "./controllers/user/DetailUserController";

// -------------------- CATEGORY --------------------
import { CreateCategoryController } from "./controllers/category/CreateCategoryController";
import { ListCategoryController } from "./controllers/category/ListCategoryController";

// -------------------- PRODUCT --------------------
import { CreateProductController } from "./controllers/product/CreateProductController";
import { ListByCategoryController } from "./controllers/product/ListByCategoryController";
import { UpdateProductController } from "./controllers/product/UpdateProductController";
import { GetProductController } from "./controllers/product/GetProductController";

// -------------------- ORDER --------------------
import { CreateOrderController } from "./controllers/order/CreateOrderController";
import { RemoveOrderController } from "./controllers/order/RemoveOrderController";
import { AddItemController } from "./controllers/order/AddItemController";
import { RemoveItemController } from "./controllers/order/RemoveItemController";
import { SendOrderController } from "./controllers/order/SendOrderController";
import { ListOrdersController } from "./controllers/order/ListOrdersController";
import { DetailOrderController } from "./controllers/order/DetailOrderController";
import { GetOrderController } from "./controllers/order/GetOrderController";
import { FinishOrderController } from "./controllers/order/FinishOrderController";
import { UpdateStatusPedidoController } from "./controllers/order/UpdateStatusPedidoController";

// -------------------- TABLES --------------------
import { CreateTablesController } from "./controllers/tables/CreateTablesController";
import { ListTablesController } from "./controllers/tables/ListTablesController";
import { ReleaseTableController } from "./controllers/tables/ReleaseTableController";

// -------------------- ROLES --------------------
import { CreateRoleController } from "./controllers/roles/CreateRoleController";

// -------------------- INGREDIENTE --------------------
import { CreateIngredienteController } from "./controllers/ingrediente/CreateIngredienteController";
import { ListIngredienteController } from "./controllers/ingrediente/ListCategoryController";

// -------------------- PRODUCT INGREDIENTS --------------------
import { ListProductIngredientsController } from "./controllers/product/ListProductIngredientsController";
import { AddIngredientToProductController } from "./controllers/product/AddIngredientToProductController";
import { RemoveIngredientFromProductController } from "./controllers/product/RemoveIngredientFromProductController";

// -------------------- PRODUCTS WITH INGREDIENTS --------------------
import { ListProductsWithIngredientsController } from "./controllers/product/ListProductsWithIngredientsController";

// -------------------- PAGAMENTO --------------------
import { UpdatePagamentoStatusController } from "./controllers/Pagamento/StatusPedidoController";
import { MetodoPagamentoController } from "./controllers/Pagamento/MetodoPagamentoController";
import { CreatePagamentoController } from "./controllers/Pagamento/CreatePagamentoController";
import { ListPaymentsController } from "./controllers/Pagamento/ListPaymentsController";
import { ClearDraftOrdersController } from "./controllers/order/ClearDraftOrdersController";

// -------------------- ADICIONAL --------------------

import { CreateAdicionalController } from "./controllers/Adicional/CreateAdicionalController";
import { ListAdicionalController } from "./controllers/Adicional/ListAdicionalController";


const router = Router();
const upload = multer(uploadConfig.upload("./tmp"));

// -------------------- USER --------------------
const createUserController = new CreateUserController();
const authUserController = new AuthUserController();
const detailUserController = new DetailUserController();

router.post("/users", (req, res) => createUserController.handle(req, res));
router.post("/session", (req, res) => authUserController.handle(req, res));
router.get("/me", isAuthenticated, (req, res) => detailUserController.handle(req, res));

// -------------------- CATEGORY --------------------
const createCategoryController = new CreateCategoryController();
const listCategoryController = new ListCategoryController();

router.post("/category", isAuthenticated, (req, res) => createCategoryController.handle(req, res));
router.get("/category", (req, res) => listCategoryController.handle(req, res));

// -------------------- PRODUCT --------------------
const createProductController = new CreateProductController();
const listByCategoryController = new ListByCategoryController();
const updateProductController = new UpdateProductController();
const getProductController = new GetProductController();

router.post("/product", isAuthenticated, upload.single("banner"), (req, res) => createProductController.handle(req, res));
router.get("/category/product", (req, res) => listByCategoryController.handle(req, res));
router.patch("/product/:id", isAuthenticated, upload.single("banner"), (req, res) => updateProductController.handle(req, res));
router.get("/product/:id", (req, res) => getProductController.handle(req, res));

// -------------------- ORDER --------------------
const createOrderController = new CreateOrderController();
const removeOrderController = new RemoveOrderController();
const addItemController = new AddItemController();
const removeItemController = new RemoveItemController();
const sendOrderController = new SendOrderController();
const listOrdersController = new ListOrdersController();
const detailOrderController = new DetailOrderController();
const finishOrderController = new FinishOrderController();
const updateStatusPedidoController = new UpdateStatusPedidoController();
const clearDraftOrdersController = new ClearDraftOrdersController();
const getOrderController = new GetOrderController();

router.post("/order", (req, res) => createOrderController.handle(req, res));
router.delete("/order", isAuthenticated, (req, res) => removeOrderController.handle(req, res));

router.post("/order/add", (req, res) => { addItemController.handle(req, res); });
router.delete("/order/remove", (req, res) => removeItemController.handle(req, res));
router.put("/order/send", (req, res) => sendOrderController.handle(req, res));

router.get("/orders", isAuthenticated, (req, res) => listOrdersController.handle(req, res));
router.get("/order/detail", isAuthenticated, (req, res) => detailOrderController.handle(req, res));
router.get("/orders/:id", isAuthenticated, (req, res) => { getOrderController.handle(req, res); });

router.put("/order/finish", isAuthenticated, (req, res) => finishOrderController.handle(req, res));
router.put("/order/status", isAuthenticated, (req, res) => updateStatusPedidoController.handle(req, res));
router.delete("/order/clear-draft", isAuthenticated, (req, res) => clearDraftOrdersController.handle(req, res));

// -------------------- PAGAMENTO --------------------
const updatePagamentoStatusController = new UpdatePagamentoStatusController();
const metodoPagamentoController = new MetodoPagamentoController();
const createPagamentoController = new CreatePagamentoController();
const listPaymentsController = new ListPaymentsController();

router.get("/payments", isAuthenticated, (req, res) => listPaymentsController.handle(req, res));
router.post("/pagamento", isAuthenticated, (req, res) => createPagamentoController.handle(req, res));
router.put("/pagamento/status", isAuthenticated, (req, res) => updatePagamentoStatusController.handle(req, res));
router.put("/pagamento/metodo", isAuthenticated, (req, res) => metodoPagamentoController.handle(req, res));

// -------------------- TABLES --------------------
const listTablesController = new ListTablesController();
const createTablesController = new CreateTablesController();
const releaseTableController = new ReleaseTableController();

router.get("/tables", (req, res) => listTablesController.handle(req, res));
router.post("/tables", isAuthenticated, (req, res) => createTablesController.handle(req, res));
router.put('/table/:id/release', isAuthenticated, (req, res) => { releaseTableController.handle(req, res).catch(err => res.status(500).json({ error: err.message })); });

// -------------------- ROLES --------------------
const createRoleController = new CreateRoleController();
router.post("/roles", (req, res) => createRoleController.handle(req, res));

// -------------------- INGREDIENTE --------------------
const createIngredienteController = new CreateIngredienteController();
const listIngredienteController = new ListIngredienteController();

router.post("/ingrediente", isAuthenticated, (req, res) => createIngredienteController.handle(req, res));
router.get("/ingrediente", isAuthenticated, (req, res) => listIngredienteController.handle(req, res));

// -------------------- PRODUCT INGREDIENTS --------------------
router.get("/product/ingredients", (req, res) => new ListProductIngredientsController().handle(req, res));
router.post("/product/add-ingredient", isAuthenticated, (req, res) => new AddIngredientToProductController().handle(req, res));
router.delete("/product/remove-ingredient", isAuthenticated, (req, res) => new RemoveIngredientFromProductController().handle(req, res));

// -------------------- PRODUCTS WITH INGREDIENTS --------------------
const listProductsWithIngredientsController = new ListProductsWithIngredientsController();

router.get("/products/with-ingredients", (req, res) => listProductsWithIngredientsController.handle(req, res));

// INGREDIENTES NOS PRODUTOS





export { router };
