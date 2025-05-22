import { Component } from '@angular/core';
import { HttpService } from '../services/http.service';
import { APIEndPoints } from '../constants/ApiEndPoints';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './view.component.html',
  styleUrl: './view.component.css',
})
export class ViewComponent {
  shareUrl: any;
  shareText: any =
    'Discover Hidden Food Gems! 🍽️ Check out these amazing food spots near you. From cozy cafes to unique eateries,' +
    "there's something for everyone. Explore the best local dining experiences now! 😋 #HiddenGems #FoodLovers #FoodieAdventure #DiscoverDeliciousness";
  shopId: any;
  dynamicTitle: string = '';
  dynamicSubtitle: string = '';
  dynamicImageUrl: string = '';
  ngOnInit(): void {
    this.getRouteId();
    // this.shareUrl = window.location.href;
    this.shareUrl = 'https://triply.co/';
    setTimeout(() => {
      this.dynamicTitle = 'Discover Hidden Gems';
      this.dynamicSubtitle = 'Tucked away bites that locals crave — now at your fingertips.';
      this.dynamicImageUrl = 'assets/images/image-1.jpg';
    }, 1000); // simulate delay
  }
  title = 'Welcome';
  foodShopDetails: any;
  mapUrl!: SafeResourceUrl;
  tags: string[] = [];

  constructor(
    private httpService: HttpService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute
  ) {}

  getFoodShops(shopId: any) {
    this.httpService
      .get(`${environment.BASE_URL + APIEndPoints.GET_FOOD_SHOP_DETAILS + shopId}`)
      .subscribe((res: any) => {
        this.foodShopDetails = res.data[0];
        this.getLocation();
        this.splitTags();
      });
  }

  showAllReviews: boolean = false;
  reviewsToShow: number = 3; // Initial number of reviews to show

  toggleReviews() {
    this.showAllReviews = !this.showAllReviews;
  }

  getReviews() {
    if (this.showAllReviews) {
      return this.foodShopDetails.reviews;
    } else {
      return this.foodShopDetails.reviews.slice(0, this.reviewsToShow);
    }
  }

  getLocation() {
    if (this.foodShopDetails.latitude && this.foodShopDetails.longitude) {
      const rawUrl = `https://www.google.com/maps?q=${this.foodShopDetails.latitude},${this.foodShopDetails.longitude}&output=embed`;
      this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);
    }
  }
  splitTags() {
    if (this.foodShopDetails.tags) {
      this.tags = this.foodShopDetails.tags
        .split(',')
        .map((tag: any) => tag.trim());
    }
  }
  getSocialIcon(platform: string): string {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return 'bi bi-facebook';
      case 'twitter':
        return 'bi bi-twitter-x'; // For X (Twitter)
      case 'instagram':
        return 'bi bi-instagram';
      case 'linkedin':
        return 'bi bi-linkedin';
      case 'whatsapp':
        return 'bi bi-whatsapp';
      default:
        return 'bi bi-share-fill';
    }
  }

  getEncodedUrl(text: string): string {
    return encodeURIComponent(text);
  }
  getRouteId() {
    this.route.paramMap.subscribe((params) => {
      this.shopId = params.get('id');
    });

    this.getFoodShops(this.shopId);
  }
}
