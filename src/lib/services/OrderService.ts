import { Item } from "../model/Item";
import { Order } from "../model/Order";
import { Length, IsString, IsBoolean, IsNumber, validateOrReject, ValidatorConstraintInterface, Validate, ValidatorConstraint } from "class-validator";
import { Account } from "../model/Account";

@ValidatorConstraint({async: true})
class IsExistingAccount implements ValidatorConstraintInterface {
    async validate(pid: string): Promise<boolean> {
        return Account.findOneOrFail({where:{pid}}) !== undefined
    }
}

class CreateItemReqValidator {
    @IsString()
    @Length(0, 255)
    image: string;

    @IsString()
    @Length(1, 255)
    name: string;

    @IsString()
    desc: string;

    @IsBoolean()
    hidden: boolean;

    @IsNumber()
    @Validate(IsExistingAccount)
    account: string;   
}

export interface CreateItemReq {
    image: string; // image url
    name: string;
    desc: string;
    hidden: boolean;
    account: string; // public id
}

class GetItemsReqValidator {
    @IsString()
    @Validate(IsExistingAccount)
    account: string; // public id
}

export interface GetItemsReq {
    account: string;
}

@ValidatorConstraint({async: true})
class IsExistingItem implements ValidatorConstraintInterface {
    async validate(item: string): Promise<boolean> {
        const i = await Item.find({where: {pid: item}})
        return i !== undefined
    }
}

class UpdateItemReqValidator {
    @IsString()
    @Validate(IsExistingItem)
    item: string

    @IsString()
    @Length(0, 255)
    image: string;

    @IsString()
    @Length(0, 255)
    name: string;

    @IsString()
    desc: string;

    @IsBoolean()
    hidden: boolean;
}

export interface UpdateItemReq {
    item: string;
    image: string;
    name: string;
    desc: string;
    hidden: boolean;
}

class GetOrdersReqValidator {
    @IsString()
    @Validate(IsExistingAccount)
    account: string;
}

export interface GetOrdersReq {
    account: string;
}

export interface LineItem {
    item: string;
    quantity: number;
}

export interface CreateOrderReq {
    account: string;
    items: LineItem[];
}

export class OrderService {
    async createItem(req: CreateItemReq): Promise<Item> {
        const v = new CreateItemReqValidator()
        v.account = req.account
        v.desc = req.desc
        v.hidden = req.hidden
        v.image = req.image
        v.name = req.name
        await validateOrReject(v)
        const account = await Account.findOneOrFail({where:{pid: req.account}})
        const item = new Item()
        item.name = req.name
        item.accountId = account.id
        item.imageUrl = req.image
        item.desc = req.desc
        item.hidden = req.hidden
        await item.save()
        return item
    }

    async getItems(req: GetItemsReq): Promise<Item[]> {
        const v = new GetItemsReqValidator()
        v.account = req.account
        await validateOrReject(v)
        const account = await Account.findOneOrFail({where: {pid: req.account}});
        const items = await Item.find({where: {accountId: account.id}})
        return items
    }

    async updateItem(req: UpdateItemReq): Promise<Item> {
        const v = new UpdateItemReqValidator()
        v.desc = req.desc
        v.hidden = req.hidden
        v.image = req.image
        v.name = req.name
        v.item = req.item
        await validateOrReject(v)
        const item = await Item.findOneOrFail({where: {pid: req.item}})
        item.desc = req.desc
        item.imageUrl = req.image
        item.name = req.name
        item.hidden = req.hidden
        await item.save()
        return item
    }
    
    async getOrders(req: GetOrdersReq): Promise<Order[]> {
        const v = new GetOrdersReqValidator()
        v.account = req.account
        await validateOrReject(v)
        const account = await Account.findOneOrFail({where: {pid: req.account}})
        const orders = await Order.find({where: {accountId: account.id}})
        return orders
    }

    async createOrder(req: CreateOrderReq): Promise<Order> {
    }
}