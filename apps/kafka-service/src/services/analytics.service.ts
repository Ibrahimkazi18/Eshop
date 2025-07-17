import prisma from "@packages/libs/prisma";


export const updateUserAnalytics = async (event : any) => {
    try {
        console.log("Incoming event:", event);

        const existingData = await prisma.useranalytics.findUnique({
            where : {
                userId : event.userId
            }
        })

        let updatedActions : any[] = existingData?.actions || [];

        const actionExists = updatedActions.some(
            (entry: any) => 
                entry.productId === event.productId && event.action === entry.action
        );

        // always store "product_view" option for recommendations
        if(event.action === "product_view") {
            updatedActions.push({
                productId: event?.productId,
                shopId: event?.shopId,
                action: "product_view",
                timestamp: new Date(),
            })
        } 

        else if (["add_to_cart", "add_to_wishlist"].includes(event.action) && !actionExists) {
            updatedActions.push({
                productId: event?.productId,
                shopId: event?.shopId,
                action: event?.action,
                timestamp: new Date(),
            })
        }

        // remove add_to_cart action when remove_from_cart is triggered
        else if (event.action === "remove_from_cart" ) {
            updatedActions = updatedActions.filter(
                (entry:any) => 
                    !(
                        entry.productId === event.productId && 
                        entry.action === "add_to_cart"
                    )
            );
        }

        // remove add_to_wishlist action when remove_from_cart is triggered
        else if (event.action === "remove_from_wishlist" ) {
            updatedActions = updatedActions.filter(
                (entry:any) => 
                    !(
                        entry.productId === event.productId && 
                        entry.action === "add_to_wishlist"
                    )
            );
        }

        // keep only the last 100 actions to prevent overstorage
        if(updatedActions.length > 100) {
            updatedActions.shift();
        }

        const extraField : any = {};

        if(event.country) {
            extraField.country = event.country;
        }

        if(event.city) {
            extraField.city = event.city;
        }

        if(event.device) {
            extraField.device = event.device;
        }

        //update or create useranalytics
        await prisma.useranalytics.upsert({
            where : {userId : event.userId},
            update: {
                lastVisited: new Date(),
                actions: updatedActions,
                ...extraField
            },
            create : {
                userId : event.userId,
                lastVisited: new Date(),
                actions: updatedActions,
                ...extraField
            }
        });

        // also update product analytics
        await updateProductAnalytics(event);
        console.log("User analytics updated for", event.userId);
    } catch (error) {
        console.error(error);
    }
}


export const updateProductAnalytics = async (event : any) => {
    try {
        if(!event.productId) return;

        // define update fields dynamically
        const updateFields : any = {};

        if(event.action === "product_view") updateFields.views = { increment : 1};
        
        if(event.action === "add_to_cart") updateFields.cartAdds = { increment : 1};
        
        if(event.action === "remove_from_cart") updateFields.cartAdds = { decrement : 1};
        
        if(event.action === "add_to_wishlist") updateFields.wihslistAdds = { increment : 1};
        
        if(event.action === "remove_from_wishlist") updateFields.wihslistAdds = { decrement : 1};
        
        if(event.action === "purchase") updateFields.purchases = { increment : 1};


        // update or create product analytics

        await prisma.productAnalytics.upsert({
            where : { productId : event.productId },
            update : {
                lastVisited: new Date(),
                ...updateFields,
            },
            create: {
                productId: event.productId,
                shopId: event.shopId || null,
                views: event.action === "product_view" ? 1 : 0,
                cartAdds: event.action === "add_to_cart" ? 1 : 0,
                wihslistAdds: event.action === "add_to_wishlist" ? 1 : 0,
                purchases: event.action === "purchase" ? 1 : 0,
                lastVisited: new Date(),
            }
        });

        console.log("Product analytics updated for", event.productId);

    } catch (error) {
        console.error("Error updating product analysis", error);
    }
}