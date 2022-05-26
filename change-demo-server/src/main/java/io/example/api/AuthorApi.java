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

@Tag(name = "Author")
@RestController
@RequestMapping(path = "api/author")
@RequiredArgsConstructor
public class AuthorApi {

    private final AuthorService authorService;
    private final BookService bookService;

    @RolesAllowed(Role.AUTHOR_ADMIN)
    @PostMapping
    public AuthorView create(@RequestBody @Valid EditAuthorRequest request) {
        return authorService.create(request);
    }

    @RolesAllowed(Role.AUTHOR_ADMIN)
    @PutMapping("{id}")
    public AuthorView edit(@PathVariable String id, @RequestBody @Valid EditAuthorRequest request) {
        return authorService.update(new ObjectId(id), request);
    }

    @RolesAllowed(Role.AUTHOR_ADMIN)
    @DeleteMapping("{id}")
    public AuthorView delete(@PathVariable String id) {
        return authorService.delete(new ObjectId(id));
    }

    @GetMapping("{id}")
    public AuthorView get(@PathVariable String id) {
        return authorService.getAuthor(new ObjectId(id));
    }

    @GetMapping("{id}/book")
    public ListResponse<BookView> getBooks(@PathVariable String id) {
        return new ListResponse<>(bookService.getAuthorBooks(new ObjectId(id)));
    }

    @PostMapping("search")
    public ListResponse<AuthorView> search(@RequestBody @Valid SearchRequest<SearchAuthorsQuery> request) {
        return new ListResponse<AuthorView>(authorService.searchAuthors(request.page(), request.query()));
    }
}
