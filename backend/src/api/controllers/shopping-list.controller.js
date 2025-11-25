import * as listService from "../../services/shopping-list.service.js";

export async function generate(req, res, next) {
  try {
    const list = await listService.generateList(req.params.id);
    res.json(list);
  } catch (err) {
    next(err);
  }
}
