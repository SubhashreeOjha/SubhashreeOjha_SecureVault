package com.securevault.service;
import javax.crypto.Mac;import javax.crypto.spec.SecretKeySpec;import java.security.SecureRandom;import java.util.Base64;import org.springframework.stereotype.Service;
@Service public class MfaService{
 public String newSecret(){byte[] b=new byte[25];new SecureRandom().nextBytes(b);return Base64.getUrlEncoder().withoutPadding().encodeToString(b);}
 private byte[] secret(String s){return Base64.getUrlDecoder().decode(s);}
 public String currentCode(String s){try{long counter=System.currentTimeMillis()/1000/30;byte[] msg=new byte[8];for(int i=7;i>=0;i--){msg[i]=(byte)counter;counter>>>=8;}Mac mac=Mac.getInstance("HmacSHA1");mac.init(new SecretKeySpec(secret(s),"HmacSHA1"));byte[] h=mac.doFinal(msg);int o=h[h.length-1]&15;int bin=((h[o]&127)<<24)|((h[o+1]&255)<<16)|((h[o+2]&255)<<8)|(h[o+3]&255);return String.format("%06d",bin%1000000);}catch(Exception e){throw new RuntimeException(e);}}
 public boolean verify(String s,String code){return currentCode(s).equals(code);}
}
