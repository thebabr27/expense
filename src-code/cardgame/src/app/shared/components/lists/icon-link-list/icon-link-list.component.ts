import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-link-list',
  templateUrl: './icon-link-list.component.html',
  styleUrls: ['./icon-link-list.component.scss']
})
export class IconLinkListComponent {
  @Input() iconList: any[] = [];
}
