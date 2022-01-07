export class InfoObject{

    private _qr_code_link: string
    private _id: string
    private _type_of_info_object_category: string
    private _is_community_member: string
    private _type_of_info_object: string
    private _image_url: string
    private _hours: Array<any>
    private _isOpenNow: any
    private _location: any
    private _categories: any
    private _address: string
    private _name: string
    private _rating_image: string
    private _rating: string
    private _photo: string
    private _alias: string
    private _coordinates: any

    //Used for TicketMaster Event Category/Event Genre info.
    private __embedded: any

    //Used for TicketMaster Event Listing Price Ranges
    private _priceRanges: Array<any>

    //Used for spotbie community members
    private _user_type: number

    public price: number = null
    public phone: string = null

    public distance = null

    public friendly_transactions = null

    public price_on = null

    public loc_x = null
    public loc_y = null

    public set id(value: any){
        this._id = value
    }

    public get id(): any{
        return this._id
    } 

    public set type_of_info_object_category(value: string){
        this._type_of_info_object_category = value
    }

    public get type_of_info_object_category(): string{
        return this._type_of_info_object_category
    }

    public set is_community_member(value: string){
        this._is_community_member = value
    }

    public get is_community_member(): string{
        return this._is_community_member
    }

    public set type_of_info_object(value: string){
        this._type_of_info_object = value
    }

    public get type_of_info_object(): string{
        return this._type_of_info_object
    }

    public set image_url(value: string){
        this._image_url = value
    }

    public get image_url(): string{
        return this._image_url
    }

    public set hours(value: Array<any>){
        this._hours = value
    }

    public get hours(): Array<any>{
        return this._hours
    }

    public set isOpenNow(value: any){
        this._isOpenNow = value
    }

    public get isOpenNow(): any{
        return this._isOpenNow
    }

    public set location(value: any){
        this._location = value
    }

    public get location(): any{
        return this._location
    }

    public set categories(value: any){
        this._categories = value
    }

    public get categories(): any{
        return this._categories
    }

    public set address(value: any){
        this._address = value
    }

    public get address(): any{
        return this._address
    }    

    public set name(value: any){
        this._name = value
    }

    public get name(): any{
        return this._name
    }  

    public set rating_image(value: any){
        this._rating_image = value
    }

    public get rating_image(): any{
        return this._rating_image
    } 

    public set rating(value: any){
        this._rating = value
    }

    public get rating(): any{
        return this._rating
    } 

    public set photo(value: any){
        this._photo = value
    }

    public get photo(): any{
        return this._photo
    } 

    public set alias(value: any){
        this._alias = value
    }

    public get alias(): any{
        return this._alias
    } 

    public set url(value: any){
        this._alias = value
    }
    
    public get url(): any{
        return this._alias
    }

    public set coordinates(value: any){
        this._coordinates = value
    }
    
    public get coordinates(): any{
        return this._coordinates
    }

    public set _embedded(value: any){
        this._embedded = value
    }
    
    public get _embedded(): any{
        return this._embedded
    }

    public set priceRanges(value: Array<any>){
        this._priceRanges = value
    }
    
    public get priceRanges(): Array<any>{
        return this._priceRanges
    }

    public set user_type(value: number){
        this._user_type = value
    }
    
    public get user_type(): number{
        return this._user_type
    }

    public set qr_code_link(value: string){
        this._qr_code_link = value
    }
    
    public get qr_code_link(): string{
        return this._qr_code_link
    }

}