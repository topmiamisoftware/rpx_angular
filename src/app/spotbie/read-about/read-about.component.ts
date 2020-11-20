import { Component, OnInit, ViewChild, HostListener, Output, EventEmitter } from '@angular/core'
import * as $ from 'jquery'
import * as spotbieGlboals from '../../globals'
import * as mobile_js_i from '../../../assets/scripts/mobile_interface.js'
import { PlatformStatsService } from '../../services/platform-stats.service'
import { MenuLoggedOutComponent } from '../spotbie-logged-out/menu-logged-out.component'
import { AdsService } from '../ads/ads.service'

@Component({
  selector: 'app-read-about',
  templateUrl: './read-about.component.html',
  styleUrls: ['./read-about.component.css']
})
export class ReadAboutComponent implements OnInit {

    @ViewChild('vc_feature_slide_show_btn') vc_feature_slide_show_btn

    @ViewChild('vc_account_perks_box') vc_account_perks_box

    @ViewChild('vc_spotbie_sign_up_box_inner') vc_spotbie_sign_up_box_inner
    @ViewChild('vc_spotbie_sign_up_box') vc_spotbie_sign_up_box

    @Output() spawnCategories = new EventEmitter()

    public account_perks: boolean = false

    public slideshow: boolean = false

    public submitted: boolean = false

    private showing_scrolled: boolean = false

    public spotbie_users: number

    public is_android: boolean

    public is_iphone: boolean

    private current_slide: number = 0

    private slide_show: boolean = false

    public slideshow_imgs = [
        'assets/images/slideshow/slide_1_features.png?v=1.3',
        'assets/images/slideshow/slide_2_features.png?v=1.3',
        'assets/images/slideshow/slide_3_features.png?v=1.3',
        'assets/images/slideshow/slide_4_features.png?v=1.3',
        'assets/images/slideshow/slide_5_features.png?v=1.3',
        'assets/images/slideshow/slide_6_features.png?v=1.3',
        'assets/images/slideshow/slide_7_features.png?v=1.3'
    ]

    public loading_default = 'assets/images/spotbie_loading_default.png'

    public slideshow_captions = [
        'Get paid for displaying optional ads on your profiles. Content creators can earn in SpotBie through public endorsements.',
        'Turn on SpotBie to see who\'s around you in real time. Add friends on the fly and see who you came in contact with today.',
        'With SpotBie you can discover new music, books, videos, images, and other media around you.',
        'See what stores are around you in an instant without having to switch between apps.',
        'Feeling hungry? Load up places to eat around you, see their reviews, menus, and hours.',
        'Content creators are allowed to upload their media and accept contributions from other users to help their careers. All users can also enable ads on their profiles to allow an extra flow of cash into their pockets.',
        'SpotBie allows your to pair up location tracking with your closest family members and friends.'
    ]

    public loading: boolean = false

    public spotbie_version: string = spotbieGlboals.VERSION;

    constructor(private platformStatsService: PlatformStatsService,
                private host: MenuLoggedOutComponent) { }
    
    public appOpen(ac): void{

        switch(ac){
            case 0:
                window.open('https://play.google.com/store/apps/details?id=com.exentriks.spotmee.spotmee&hl=en_US', '_blank')
                break
            case 1:
                window.open('https://apps.apple.com/us/app/spotbie/id1439327004?app=itunes&ign-mpt=uo%3D4', '_blank')
                break                                
        }

    }

    scrollTo(el: string): void{
        $('html, body').animate({ scrollTop: $(el).offset().top }, 'slow')
    }

    public searchEvents(){
        this.spawnCategories.emit('events')
    }

    public searchRetail(){
        this.spawnCategories.emit('shopping');
    }

    public searchFood(){
        this.spawnCategories.emit('food');
    }

    public signUp(): void{
        this.host.signUpWindow.open = true
    }

    public slidePrev(): void {

        let slide_to_start: number

        if (this.current_slide == 0) {
            slide_to_start = this.slideshow_imgs.length - 1
            this.startslide(slide_to_start)
        } else {
            slide_to_start = this.current_slide - 1
            this.startslide(slide_to_start)
        }

    }

    public slideNext(): void {

        let slide_to_start: number

        if (this.current_slide == this.slideshow_imgs.length - 1) {
            slide_to_start = 0
            this.startslide(slide_to_start)
        } else {
            slide_to_start = this.current_slide + 1
            this.startslide(slide_to_start)
        }

    }

    public startslide(i): void {

        this.current_slide = i
        document.getElementById('vc_slideshow_main').style.background = 'url(' + this.slideshow_imgs[i] + ')'
        document.getElementById('vc_slideshow_caption').innerHTML = this.slideshow_captions[i]

    }

    public openSlideShow(i): void {
        document.getElementById('spotbie_slide_show').style.display = 'block'
        this.startslide(i)
    }

    public closeSlideShow(): void {
        document.getElementById('spotbie_slide_show').style.display = 'none'
    }

    public accountPerks(): void {
        this.account_perks = true
    }

    public closePerks(): void {
        this.account_perks = false
    }

    public getTotalUsers(): void {

        this.platformStatsService.publicStatsApi().subscribe(
        resp => {
            this.populateTotalUsers(resp)
        }, 
        error => {
            this.getTotalUsersErrorHandler(error)
        })

    }

    private getTotalUsersErrorHandler(error){
        console.log("getTotalUsers Error", error)
    }

    private populateTotalUsers(resp: any): void{
        this.spotbie_users = resp
    }

    public getApp(ac) : void{
        switch (ac) {
            case 0:
                window.open('https://play.google.com/store/apps/details?id=com.exentriks.spotmee.spotmee', '_blank')
                break
            case 1:
                window.open('https://itunes.apple.com/us/app/spotbie/id1439327004?ls=1&mt=8', '_blank')
                break
        }
    }

    public scrollT() : void{
        window.scrollTo(0, 0)
    }

    @HostListener('window:scroll', [])
    onWindowScroll() {
        // we'll do some stuff here when the window is scrolled
        const scroll_y = window.scrollY
        if (scroll_y > 150 && !this.showing_scrolled) {
            // show them
            this.showing_scrolled = true
        } else if (scroll_y < 150 && this.showing_scrolled) {
            // hide them
            this.showing_scrolled = false
        }
    }

    ngOnInit() {

        this.loading = true
    }

    ngAfterViewInit() {
        this.is_android = mobile_js_i.android_i
        this.is_iphone = mobile_js_i.iphone_i
        this.getTotalUsers()
    }
}