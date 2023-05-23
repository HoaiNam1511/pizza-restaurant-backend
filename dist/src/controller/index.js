"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeImageCloud = exports.getWeek = exports.getNewId = void 0;
const cloudinary_1 = __importDefault(require("cloudinary"));
const getNewId = ({ TableName, }) => __awaiter(void 0, void 0, void 0, function* () {
    const newId = yield TableName.findOne({
        attributes: ['id'],
        order: [['id', 'DESC']],
    });
    return newId.id;
});
exports.getNewId = getNewId;
const getWeek = () => {
    const today = new Date();
    let startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6);
    startOfWeek = startOfWeek.toISOString().split('T')[0];
    let endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    endOfWeek = endOfWeek.toISOString().split('T')[0];
    return {
        startOfWeek,
        endOfWeek,
    };
};
exports.getWeek = getWeek;
const removeImageCloud = ({ TableRemove, id, }) => __awaiter(void 0, void 0, void 0, function* () {
    const pathImageProduct = yield TableRemove.findOne({
        attributes: ['image'],
        where: {
            id: id,
        },
    });
    const parts = pathImageProduct.image.split('/');
    const imageName = `${parts[parts.length - 2]}/${parts[parts.length - 1].split('.')[0]}`;
    cloudinary_1.default.v2.uploader.destroy(imageName);
});
exports.removeImageCloud = removeImageCloud;
