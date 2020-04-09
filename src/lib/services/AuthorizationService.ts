import { UpdateAccountReq } from "./UserService";

interface IdentityContext {
    userId: number;
    accountId: number;
}

export class AuthorizationService {
    async canUpdateAccount(ctx: IdentityContext, req: UpdateAccountReq): Promise<boolean> {
        // return req.account === ctx.accountId
    }
}   