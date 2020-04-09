import { User } from "../model/User";
import { Account } from "../model/Account";
import { Length, IsEmail, validateOrReject, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, Validate, IsString, IsAlphanumeric, IsBoolean, IsNumber, Min, Max } from 'class-validator'
import { hashSync } from "bcrypt";
import { Currency } from "../model/Currency";

export interface GetCurrenciesReq {
}

export interface CreateUserReq {
    email: string;
    password: string;
}

@ValidatorConstraint({async: true})
class UniqueUserEmail implements ValidatorConstraintInterface {
    async validate(email: string, _args: ValidationArguments) {
        const user = await User.findOne({where:{email}})
        return user === undefined
    }
}

class CreateUserRequestValidator {
    @IsString()
    @IsEmail()
    @Validate(UniqueUserEmail)
    email: string;

    @IsString()
    @Length(6, 100)
    password: string;
}

@ValidatorConstraint({async: false})
class IsValidCurrency implements ValidatorConstraintInterface {
    async validate(currency: string) {
        return Object.values(Currency as any).find(c => c === currency) !== -1
    }
}

@ValidatorConstraint({async: true})
class IsExistingUser implements ValidatorConstraintInterface {
    async validate(user: string): Promise<boolean> {
        return User.findOne({where:{pid: user}}) !== undefined
    }
}

class CreateAccountReqValidator {
    @IsString()
    @Validate(IsExistingUser)
    user: string;

    @IsString()
    @Length(1, 255)
    name: string;

    @IsString()
    @Length(1,255)
    @IsAlphanumeric()
    slug: string;

    @IsBoolean()
    online: boolean;

    @IsString()
    @Validate(IsValidCurrency)
    currency: string;

    @IsNumber()
    @Min(0)
    @Max(9999)
    tax: number;
}

export interface CreateAccountReq {
    user: string;
    name: string;
    slug: string;
    online: boolean;
    currency: string;
    tax: number;
}

@ValidatorConstraint({async: true})
class IsAccountSluggable implements ValidatorConstraintInterface {
    async validate(_slug: string, args: ValidationArguments) {
        const validator = args.object as UpdateAccountReqValidator
        const account = await Account.findOneOrFail(validator.account)
        return account.slug === ''
    }
}

class UpdateAccountReqValidator {
    @IsString()
    account: string;

    @IsString()
    @Length(1, 255)
    name: string;

    @IsString()
    @Length(1,255)
    @IsAlphanumeric()
    @Validate(IsAccountSluggable)
    slug: string;

    @IsBoolean()
    online: boolean;

    @IsString()
    @Validate(IsValidCurrency)
    currency: string;

    @IsNumber()
    @Min(0)
    @Max(9999)
    tax: number;
}

export interface UpdateAccountReq {
    account: string;
    name: string;
    slug: string;
    online: boolean;
    currency: string;
    tax: number;
}

export class UserService {
    getCurrencies(_req: GetCurrenciesReq): string[] {
        return Object.keys(Currency)
    }

    async createUser(req: CreateUserReq): Promise<User> {
        const v = new CreateUserRequestValidator()
        v.email = req.email
        v.password = req.password
        await validateOrReject(v)
        const user = new User()
        user.email = req.email
        user.passwordHash = hashSync(req.password, 10)
        await user.save()
        return user
    }

    async createAccount(req: CreateAccountReq): Promise<Account> {
        const v = new CreateAccountReqValidator()
        v.currency = req.currency
        v.name = req.name
        v.online = req.online
        v.slug = req.slug
        v.tax = req.tax
        await validateOrReject(v)
        const account = new Account()
        account.name = req.name
        account.currency = req.currency
        account.online = req.online
        account.slug = req.slug
        account.tax = req.tax
        await account.save()
        return account
    }

    async updateAccount(req: UpdateAccountReq): Promise<Account> {
        const v = new UpdateAccountReqValidator()
        v.currency = req.currency
        v.name = req.name
        v.online = req.online
        v.slug = req.slug
        v.tax = req.tax
        await validateOrReject(v)
        const account = await Account.findOneOrFail(req.account)
        account.name = req.name
        account.currency = req.currency
        account.online = req.online
        account.slug = req.slug
        account.tax = req.tax
        await account.save()
        return account
    }
}
