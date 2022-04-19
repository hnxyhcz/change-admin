package io.example.domain.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

/**
 * @author huang.cz
 * @since 2022/4/10 22:41
 */
@Document(collection = "apis")
@Getter
@Setter
public class Api {
    @Id
    private ObjectId id;

    @Indexed(unique = true)
    private String path;
    @Indexed(unique = true)
    private String method;
    /**
     * 接口简要说明
     */
    private String summary;
    /**
     * 组别
     */
    @Indexed(unique = true)
    private String group;
    /**
     * 是否允许匿名访问
     */
    private boolean anonymous = false;

    public Api() {}

    public Api(String path, String method) {
        this.path = path;
        this.method = method;
    }

    public Api(String path, String method, String group) {
        this.path = path;
        this.method = method;
        this.group = group;
    }

    public Api(String path, String method, String summary, String description) {
        this.path = path;
        this.method = method;
        this.summary = summary;
    }

}
