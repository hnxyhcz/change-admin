package io.example.service;

import java.util.List;

import javax.validation.ValidationException;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import com.mongodb.client.result.DeleteResult;

import io.example.domain.dto.SearchApiQuery;
import io.example.domain.model.Api;
import io.example.repository.ApiRepo;
import lombok.RequiredArgsConstructor;

/**
 * @author huang.cz
 * @since 2022/4/10 23:41
 */
@Service
@RequiredArgsConstructor
public class ApiService {

    private final ApiRepo apiRepo;

    public Api create(Api api) {
        SearchApiQuery apiQuery = new SearchApiQuery(api.getPath(), api.getMethod());
        List<Api> apiList = apiRepo.searchApis(apiQuery);
        if (apiList != null && apiList.size() > 0) {
            throw new ValidationException("api exists!");
        }
        return apiRepo.save(api);
    }

    public Api update(ObjectId id, Api api) {
        api.setId(id);
        return apiRepo.save(api);
    }

    public Api upsert(Api api) {
        SearchApiQuery apiQuery = new SearchApiQuery(api.getPath(), api.getMethod());
        List<Api> apiList = apiRepo.searchApis(apiQuery);
        if (apiList != null && apiList.size() > 0) {
            return update(apiList.get(0).getId(), api);
        }
        return create(api);
    }

    public long deleteIdNin(List<ObjectId> idList) {
        DeleteResult result = apiRepo.deleteIdNin(idList);
        return result.getDeletedCount();
    }
}
