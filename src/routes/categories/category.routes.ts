import { Router } from "express";
import { getCategories } from "../../controllers/categories/categories.controller";

const categoryRoutes = Router();

categoryRoutes.get("/", getCategories);

export default categoryRoutes;
