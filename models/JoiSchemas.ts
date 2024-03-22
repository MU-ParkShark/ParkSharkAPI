import Joi from "joi";

export const userSchema = Joi.object({
    email: Joi.string()
    .required(),
    password: Joi.string()
    .required(),
    vehicle_make: Joi.string()
    .alphanum()
    .required(),
    vehicle_model: Joi.string()
    .alphanum()
    .required(),
    vehicle_year: Joi.number()
    .required(),
    vehicle_color: Joi.string()
    .required(),
    license_plate: Joi.string()
    .required(),
    tag_id: Joi.number(),
    first_name: Joi.string()
    .required(),
    last_name: Joi.string()
    .required()
});

export const scheduleSchema = Joi.object({
    user_id: Joi.number()
    .required(),
    time_in: Joi.string()
    .required(),
    day_of_week: Joi.number()
    .required(),
    event_name: Joi.string()
    .required(),
    lots: Joi.object()
});

export const spotSchema = Joi.object({
    is_handicap: Joi.bool()
    .required(),
    latlong: [
        Joi.number(),
        Joi.number() 
    ],
    is_available: Joi.bool(),
    row_id: Joi.number(),
    lot_id: Joi.number()
});
