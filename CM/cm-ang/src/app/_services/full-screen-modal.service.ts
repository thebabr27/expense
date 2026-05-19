import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FullScreenModalService {

  visible = false;

  title = '';

  items: any[] = [];

  labelKey = 'name';

  onSelect?: (item: any) => void;

  open(
    title: string,
    items: any[],
    onSelect: (item: any) => void,
    labelKey: string = 'name'
  ) { 
    this.title = title;

    this.items = items;

    this.onSelect = onSelect;

    this.labelKey = labelKey;

    this.visible = true;

  }

  close() {

    this.visible = false;

  }

  select(item: any) {

    if (this.onSelect) {

      this.onSelect(item);

    }

    this.close();

  }

}