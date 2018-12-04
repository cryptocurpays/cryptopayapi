package cn.api.demo;

import org.springframework.beans.factory.InitializingBean;

/**
 * Created by leo on 2018/12/3.
 */
public class Launcher implements InitializingBean {

    @Override
    public void afterPropertiesSet() throws Exception {
        System.out.println("123123");
    }
}
