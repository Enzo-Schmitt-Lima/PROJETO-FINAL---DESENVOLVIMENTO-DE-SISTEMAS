import { Router } from 'express';
import multer from 'multer';
import 'express-async-errors';
import { asyncHandler } from './utils/asynchandler';

import { CreateUserController } from './controllers/user/CreateUserController';
import { AuthUserController } from './controllers/user/AuthUserController';
import { DetailUserController } from './controllers/user/DetailUserController';

import { CreateCategoryController } from './controllers/category/CreateCategoryController';
import { ListCategoryController } from './controllers/category/ListCategoryController';

import { CreateProductController } from './controllers/product/CreateProductController';
import { ListByCategoryController } from './controllers/product/ListByCategoryController';
import { UpdateProductController } from './controllers/product/UpdateProductController';

import { CreateOrderController } from './controllers/order/CreateOrderController';
import { RemoveOrderController } from './controllers/order/RemoveOrderController';
import { AddItemController } from './controllers/order/AddItemController';
import { RemoveItemController } from './controllers/order/RemoveItemController';
import { SendOrderController } from './controllers/order/SendOrderController';
import { ListOrdersController } from './controllers/order/ListOrdersController';
import { DetailOrderController } from './controllers/order/DetailOrderController';
import { FinishOrderController } from './controllers/order/FinishOrderController';
import { UpdateStatusPedidoController } from './controllers/order/UpdateStatusPedidoController';

import { CreateTablesController } from './controllers/tables/CreateTablesController';
import { ListTablesController } from './controllers/tables/ListTablesController';

import { CreateRoleController } from './controllers/roles/CreateRoleController';
import { CreateIngredienteController } from './controllers/ingrediente/CreateIngredienteController';
import { ListIngredienteController } from './controllers/ingrediente/ListCategoryController';

import { UpdatePagamentoStatusController } from './controllers/Pagamento/StatusPedidoController';
import { MetodoPagamentoController } from './controllers/Pagamento/MetodoPagamentoController';

import { isAuthenticated } from './middlewares/isAuthenticated';
import uploadConfig from './config/multer';

const router = Router();
const upload = multer(uploadConfig.upload('./tmp'));

// -------------------- USER --------------------
router.post('/users', asyncHandler((req, res) => new CreateUserController().handle(req, res)));
router.post('/session', asyncHandler((req, res) => new AuthUserController().handle(req, res)));
router.get('/me', isAuthenticated, asyncHandler((req, res) => new DetailUserController().handle(req, res)));

// -------------------- CATEGORY --------------------
router.post('/category', isAuthenticated, asyncHandler((req, res) => new CreateCategoryController().handle(req, res)));
router.get('/category', isAuthenticated, asyncHandler((req, res) => new ListCategoryController().handle(req, res)));

// -------------------- PRODUCT --------------------
router.post('/product', isAuthenticated, upload.single('banner'), asyncHandler((req, res) => new CreateProductController().handle(req, res)));
router.get('/category/product', isAuthenticated, asyncHandler((req, res) => new ListByCategoryController().handle(req, res)));
router.patch('/product/:id', isAuthenticated, upload.single('banner'), asyncHandler((req, res) => new UpdateProductController().handle(req, res)));

// -------------------- ORDER --------------------
router.post('/order', isAuthenticated, asyncHandler((req, res) => new CreateOrderController().handle(req, res)));
router.delete('/order', isAuthenticated, asyncHandler((req, res) => new RemoveOrderController().handle(req, res)));

router.post('/order/add', isAuthenticated, asyncHandler((req, res) => new AddItemController().handle(req, res)));
router.delete('/order/remove', isAuthenticated, asyncHandler((req, res) => new RemoveItemController().handle(req, res)));
router.put('/order/send', isAuthenticated, asyncHandler((req, res) => new SendOrderController().handle(req, res)));

router.get('/orders', isAuthenticated, asyncHandler((req, res) => new ListOrdersController().handle(req, res)));
router.get('/order/detail', isAuthenticated, asyncHandler((req, res) => new DetailOrderController().handle(req, res)));

router.put('/order/finish', isAuthenticated, asyncHandler((req, res) => new FinishOrderController().handle(req, res)));
router.put('/order/status', isAuthenticated, asyncHandler((req, res) => new UpdateStatusPedidoController().handle(req, res)));

router.put('/pagamento/status', isAuthenticated, asyncHandler((req, res) => new UpdatePagamentoStatusController().handle(req, res)));
router.put('/pagamento/metodo', isAuthenticated, asyncHandler((req, res) => new MetodoPagamentoController().handle(req, res)));

// -------------------- TABLES --------------------
router.get('/tables', isAuthenticated, asyncHandler((req, res) => new ListTablesController().handle(req, res)));
router.post('/tables', isAuthenticated, asyncHandler((req, res) => new CreateTablesController().handle(req, res)));

// -------------------- ROLES --------------------
router.post('/roles', asyncHandler((req, res) => new CreateRoleController().handle(req, res)));

// -------------------- INGREDIENTE --------------------
router.post('/ingrediente', isAuthenticated, asyncHandler((req, res) => new CreateIngredienteController().handle(req, res)));
router.get('/ingrediente', isAuthenticated, asyncHandler((req, res) => new ListIngredienteController().handle(req, res)));

export { router };
