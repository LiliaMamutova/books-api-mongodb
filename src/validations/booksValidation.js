import {Joi, Segments} from "celebrate";

export const getAllBooksSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().required(),
    perPage: Joi.number().integer().required(),
  })

}



export const bookIdSchema = {
  [Segments.PARAMS]: Joi.object({
    bookId: Joi.string().custom().required(),
  })
}
