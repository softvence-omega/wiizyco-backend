import catchAsync from "../../util/catchAsync";
import userSubscriptionService from "./userSubscription.service";

const getUserById = catchAsync(async (req, res) => {
    const { userId } = req.params;

    const result = await userSubscriptionService.getUserById(userId);
    res.status(200).json({
        success: true,
        message: "Subscription retrieved successfully",
        data: {
            subscription: result
        }
    });
})


const userSubscriptionController = {
    getUserById
};

export default userSubscriptionController;