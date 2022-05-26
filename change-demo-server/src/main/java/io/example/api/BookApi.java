package io.example.api;

import io.example.domain.dto.*;
import io.example.domain.model.Role;
import io.example.service.AuthorService;
import io.example.service.BookService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.web.bind.annotation.*;

import javax.annotation.security.RolesAllowed;
import javax.validation.Valid;

@Tag(name = "Book")
@RestController
@RequestMapping(path = "api/book")
@RequiredArgsConstructor
public class BookApi {

    private final BookService bookService;
    private final AuthorService authorService;

    @RolesAllowed(Role.BOOK_ADMIN)
    @PostMapping
    public BookView create(@RequestBody @Valid EditBookRequest request) {
        return bookService.create(request);
    }

    @RolesAllowed(Role.BOOK_ADMIN)
    @PutMapping("{id}")
    public BookView edit(@PathVariable String id, @RequestBody @Valid EditBookRequest request) {
        return bookService.update(new ObjectId(id), request);
    }

    @RolesAllowed(Role.BOOK_ADMIN)
    @DeleteMapping("{id}")
    public BookView delete(@PathVariable String id) {
        return bookService.delete(new ObjectId(id));
    }

    @GetMapping("{id}")
    public BookView get(@PathVariable String id) {
        return bookService.getBook(new ObjectId(id));
    }

    @GetMapping("{id}/author")
    public ListResponse<AuthorView> getAuthors(@PathVariable String id) {
        return new ListResponse<>(authorService.getBookAuthors(new ObjectId(id)));
    }

    @PostMapping("search")
    public ListResponse<BookView> search(@RequestBody @Valid SearchRequest<SearchBooksQuery> request) {
        return new ListResponse<BookView>(bookService.searchBooks(request.page(), request.query()));
    }
}
