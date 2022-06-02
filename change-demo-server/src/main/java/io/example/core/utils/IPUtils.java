package io.example.core.utils;

import com.anji.captcha.util.StringUtils;

import javax.servlet.http.HttpServletRequest;

/**
 * @author huang.cz
 * @since 2022/6/2 9:11
 */
public class IPUtils {

    public static String getRemoteId(HttpServletRequest request) {
        String ua = request.getHeader("user-agent");
        String ip = getRemoteIpFromXfwd(request.getHeader("X-Forwarded-For"));
        return StringUtils.isNotBlank(ip) ? ip + ua : request.getRemoteAddr() + ua;
    }

    private static String getRemoteIpFromXfwd(String xfwd) {
        if (StringUtils.isNotBlank(xfwd)) {
            String[] ipList = xfwd.split(",");
            return StringUtils.trim(ipList[0]);
        } else {
            return null;
        }
    }
}
