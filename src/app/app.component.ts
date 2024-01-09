import {Component, HostListener} from '@angular/core';
import {VersionCheckService} from './services/version-check.service';
import {SpotbieMetaService} from './services/meta/spotbie-meta.service';
import {
  spotbieMetaDescription,
  spotbieMetaImage,
  spotbieMetaTitle,
} from './constants/spotbie';
import {environment} from '../environments/environment';

const SPOTBIE_META_DESCRIPTION = spotbieMetaDescription;
const SPOTBIE_META_TITLE = spotbieMetaTitle;
const SPOTBIE_META_IMAGE = spotbieMetaImage;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'spotbie';
  testMode = false;
  displayTestModeOptions = false;
  lat: number = null;
  lng: number = null;

  constructor(
    private versionCheckService: VersionCheckService,
    private spotbieMetaService: SpotbieMetaService
  ) {}

  @HostListener('window:load', [])
  onWindowLoaded() {
    this.versionCheckService.initVersionCheck(environment.versionCheckURL);
  }

  openTestModeSpecs(): void {
    this.displayTestModeOptions = true;
  }

  closeTestModeSpecs(): void {
    this.displayTestModeOptions = false;
  }

  ngOnInit() {
    if (environment.staging) {
      this.testMode = true;
      this.lat = environment.myLocX;
      this.lng = environment.myLocY;
    }

    this.spotbieMetaService.setTitle(SPOTBIE_META_TITLE);
    this.spotbieMetaService.setDescription(SPOTBIE_META_DESCRIPTION);
    this.spotbieMetaService.setImage(SPOTBIE_META_IMAGE);
  }
}
