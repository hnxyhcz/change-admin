package io.example.core.entity;

import com.baomidou.mybatisplus.core.toolkit.StringUtils;
import com.github.pagehelper.PageHelper;
import lombok.Data;

/**
 * @author javahuang
 * @date 2021/8/31
 */
@Data
public class PageQuery {

    private int current = 1;

    private int pageSize = 20;

    private String sorter;

    public int getPageSize() {
        if (this.pageSize == -1) {
            return Integer.MAX_VALUE;
        }
        return pageSize;
    }

    public String getSorter() {
        return sorter;
    }

    public void setSorter(String sorter) {
        if (StringUtils.isEmpty(sorter)) {
            return;
        }
        String sortKey = StringUtils.camelToUnderline(sorter.trim().split("\\s")[0]);
        String sortValue = "";
        if (sorter.endsWith(" ascend")) {
            sortValue += " asc";
        } else if (sorter.endsWith(" descend")) {
            sortValue += " desc";
        }
        this.sorter = String.format("%s %s", sortKey, sortValue);
        // 使用 PageHelper 自动分页
        PageHelper.orderBy(this.sorter);
    }
}
