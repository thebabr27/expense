import { Component, Input } from "@angular/core";
import { SharedModule } from "../shared/shared.module";  
import { CommentaryEvent } from "../../_features/match/match.component";

@Component({
  selector: 'app-commentary',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './commentary.component.html',
  styleUrl: './commentary.component.css'
})
export class CommentaryComponent {

  @Input() commentary: CommentaryEvent[] = [];

}