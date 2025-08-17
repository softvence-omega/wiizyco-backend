import idConverter from "../../util/idConvirter";
import { UserSubscriptionModel } from "./userSubscription.model";

const getUserById = async (userId: string) => {
    console.log("Fetching subscription for user:", userId);
    const id = idConverter(userId);
    const result = await UserSubscriptionModel.find({ userId: id });
    if (!result || result.length === 0) {
        throw new Error("Subscription not found");
    }
    return result;
};

const userSubscriptionService = {
    getUserById
};

export default userSubscriptionService;
