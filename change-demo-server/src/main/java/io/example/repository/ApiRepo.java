package io.example.repository;

import com.mongodb.client.result.DeleteResult;
import io.example.domain.dto.SearchApiQuery;
import io.example.domain.exception.NotFoundException;
import io.example.domain.model.Api;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import java.util.List;

@Repository
public interface ApiRepo extends MongoRepository<Api, ObjectId>, ApiRepoCustom {

    default Api getById(ObjectId id) {
        return findById(id).orElseThrow(() -> new NotFoundException(Api.class, id));
    }

    @Override
    List<Api> findAllById(Iterable<ObjectId> ids);
}

interface ApiRepoCustom {

    List<Api> searchApis(SearchApiQuery query);

    DeleteResult deleteIdNin(List<ObjectId> idList);
}

@RequiredArgsConstructor
class ApiRepoCustomImpl implements ApiRepoCustom {

    private final MongoTemplate mongoTemplate;

    @Override
    public List<Api> searchApis(SearchApiQuery query) {
        Query condition = new Query();

        if (StringUtils.hasText(query.path())) {
            condition.addCriteria(Criteria.where("path").is(query.path()));
        }
        if (StringUtils.hasText(query.method())) {
            condition.addCriteria(Criteria.where("method").is(query.method()));
        }

        return mongoTemplate.find(condition, Api.class);
    }

    @Override
    public DeleteResult deleteIdNin(List<ObjectId> idList) {
        Query condition = new Query();
        if (idList != null && idList.size() > 0) {
            condition.addCriteria(Criteria.where("id").nin(idList));
        }
        return mongoTemplate.remove(condition, Api.class);
    }
}
