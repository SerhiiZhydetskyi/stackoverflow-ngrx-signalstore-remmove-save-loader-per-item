import {bootstrapApplication} from "@angular/platform-browser";
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import {
    Component,
    computed,
    effect,
    inject,
    provideExperimentalZonelessChangeDetection,
    Signal
} from "@angular/core";
import {JsonPipe} from "@angular/common";
import {MatList, MatListItem} from "@angular/material/list";
import {MatDivider} from "@angular/material/divider";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {ReactiveFormsModule} from "@angular/forms";
import {BooksStore} from "./app/stores/books.store";
import {RandomHelper} from "./app/helpers/random.helper";
import {IBook} from "./app/interfaces/book.interface";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        JsonPipe,
        MatList,
        MatDivider,
        MatListItem,
        MatProgressSpinner,
        ReactiveFormsModule
    ],
    providers: [BooksStore],
    template: `
        @if (bookStore.isLoading() && !processingBook) {
            <div class="backdrop">
                <mat-spinner class="spinner"></mat-spinner>
            </div>
        }
        <mat-list>
            <mat-divider></mat-divider>

            @for (book of bookStore.entities(); track book.id) {
                <div class="item-holder">
                    @if (isBookProcessing(book)()) {
                        <div class="backdrop">
                            <mat-spinner class="spinner"></mat-spinner>
                        </div>
                    }
                    <mat-list-item><span class="text">{{ book.name }} with id:{{ book.id }}</span>
                        <button class="btn-remove" (click)="removeBook(book)">remove</button>
                    </mat-list-item>
                    <mat-divider></mat-divider>
                </div>
            }
        </mat-list>
        <button (click)="addBook()">addBook</button>
    `,
    styleUrl: './app/app.component.css'
})

export class AppComponent {

    bookStore = inject(BooksStore);

    processingBook: IBook | null = null;

    constructor() {
        effect(() => {
            if (!this.bookStore.isLoading()) {
                this.processingBook = null;
                console.log(this.processingBook)
            }
        });
    }

    isBookProcessing(book: IBook): Signal<boolean> {
        return computed(() => {
            return !!(book.id === this.processingBook?.id && this.bookStore.isLoading());
        })
    }

    addBook() {
        this.bookStore.add({
            id: RandomHelper.getRandomInt(10000, 99999),
            name: RandomHelper.getRandomString(5),
            pageCount: 0
        })
    }

    removeBook(book: IBook) {
        this.processingBook = book;
        this.bookStore.remove(book);
    }
}

bootstrapApplication(AppComponent, {
    providers: [
        provideAnimationsAsync(),
        provideExperimentalZonelessChangeDetection()
    ]
}).then();
