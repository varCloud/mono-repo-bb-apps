interface PaymentTotals {
    totalAmount?: number;
    totalPlatformFee?: number;
    totalCreatorPayout?: number;
}


export class PaymentTotalsModel implements PaymentTotals {

    totalAmount?: number = 0;
    totalCreatorPayout?: number | undefined = 0;
    totalPlatformFee?: number = 0;
    constructor(data: any) {
        this.totalAmount = data?.totalAmount ?? this.totalAmount;
        this.totalCreatorPayout = data?.totalCreatorPayout ?? this.totalCreatorPayout;
        this.totalPlatformFee = data?.totalPlatformFee ?? this.totalPlatformFee;
    }

}
