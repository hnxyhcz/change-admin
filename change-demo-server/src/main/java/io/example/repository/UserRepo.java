package io.example.repository;

import io.example.domain.dto.Page;
import io.example.domain.dto.SearchUsersQuery;
import io.example.domain.exception.NotFoundException;
import io.example.domain.model.User;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.aggregation.TypedAggregation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.limit;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.match;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.newAggregation;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.skip;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.sort;

@Repository
@CacheConfig(cacheNames = "users")
public interface UserRepo extends UserRepoCustom, MongoRepository<User, ObjectId> {

  @CacheEvict(allEntries = true) <S extends User> List<S> saveAll(Iterable<S> entities);

  @Caching(evict = {
    @CacheEvict(key = "#p0.id", condition = "#p0.id != null"),
    @CacheEvict(key = "#p0.username", condition = "#p0.username != null")
  }) <S extends User> S save(S entity);

  @Cacheable
  Optional<User> findById(ObjectId objectId);

  @Cacheable
  default User getById(ObjectId id) {
    Optional<User> optionalUser = findById(id);
    if (optionalUser.isEmpty()) {
      throw new NotFoundException(User.class, id);
    }
    if (!optionalUser.get().isEnabled()) {
      throw new NotFoundException(User.class, id);
    }
    return optionalUser.get();
  }

  @Cacheable
  Optional<User> findByUsername(String username);

}

interface UserRepoCustom {

  List<User> searchUsers(Page page, SearchUsersQuery query);

}

@RequiredArgsConstructor
class UserRepoCustomImpl implements UserRepoCustom {

  private final MongoTemplate mongoTemplate;

  @Override
  public List<User> searchUsers(Page page, SearchUsersQuery query) {
    List<AggregationOperation> operations = new ArrayList<>();

    List<Criteria> criteriaList = new ArrayList<>();
    if (StringUtils.hasText(query.id())) {
      criteriaList.add(Criteria.where("id").is(new ObjectId(query.id())));
    }
    if (StringUtils.hasText(query.username())) {
      criteriaList.add(Criteria.where("username").regex(query.username(), "i"));
    }
    if (StringUtils.hasText(query.fullName())) {
      criteriaList.add(Criteria.where("fullName").regex(query.fullName(), "i"));
    }
    if (!criteriaList.isEmpty()) {
      Criteria userCriteria = new Criteria().andOperator(criteriaList.toArray(new Criteria[0]));
      operations.add(match(userCriteria));
    }

    operations.add(sort(Sort.Direction.DESC, "createdAt"));
    operations.add(skip((page.number() - 1) * page.limit()));
    operations.add(limit(page.limit()));

    TypedAggregation<User> aggregation = newAggregation(User.class, operations);
    AggregationResults<User> results = mongoTemplate.aggregate(aggregation, User.class);
    return results.getMappedResults();
  }
}
