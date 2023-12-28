import { IBE, TREnhancementEngagementMethods, TREnhancementEngagementType } from './types';
import { EngagementCtx} from '../trans-render/types';

export const TREnhancementEngagement = (superclass: TREnhancementEngagementType) => class extends superclass implements TREnhancementEngagementMethods{
    async loadBe(be: string){}    
    async attachEnhancement(model: any, el: Element, ctx: EngagementCtx<any>): Promise<IBE>{
            const {be, with: w} = ctx;
            this.loadBe(be!);
            if(w !== undefined){
                Object.assign((<any>el).beEnhanced.by[be!], w);
            }
            return await (<any>el).beEnhanced.whenResolved(be!) as IBE;
        }

}