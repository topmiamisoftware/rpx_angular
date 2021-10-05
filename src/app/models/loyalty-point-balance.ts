export class LoyaltyPointBalance {

    private _balance: number
    private _reset_balance: number
    private _loyalty_point_dollar_percent_value: number | string
    private _end_of_month: string

    get balance(): number {
        return this._balance
    }
    set balance(value: number) {
        this._balance = value
    }

    get reset_balance(): number {
        return this._reset_balance
    }
    set reset_balance(value: number) {
        this._reset_balance = value
    }

    get loyalty_point_dollar_percent_value(): number | string {
        return this._loyalty_point_dollar_percent_value
    }
    set loyalty_point_dollar_percent_value(value: number | string) {
        this._loyalty_point_dollar_percent_value = value
    }

    get end_of_month(): string {
        return this._end_of_month
    }
    set end_of_month(value: string) {
        this._end_of_month = value
    }

}

