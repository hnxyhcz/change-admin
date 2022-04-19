package io.example.domain.dto;

import lombok.Builder;

public record SearchApiQuery(
  String path,
  String method
) {

  @Builder
  public SearchApiQuery {
  }

  public SearchApiQuery() {
    this(null, null);
  }
}
