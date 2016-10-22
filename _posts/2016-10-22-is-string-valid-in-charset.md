---
layout: post
title: 如何判断某个字符串在某个字符集下是否有效
category: cn
---

{{ page.title }}
================

UTF-8字符集是一个较大的字符集，很多国内的系统都在用GBK、甚至是GB2312字符集。一个字符串在较大字符集（如UTF-8）里能正确显示，到了较小字符集（如GBK）之后会显示成一堆问号，甚至导致系统出错。如何避免这样的问题呢？

最好的办法当然是大家用同一个的字符集，比如UTF-8。但这只是个理想，更多的时候是我们改不了任何一个系统所采用的字符集。另一个切实可行的办法是避免把一些对方字符集涵盖不了的字符传给他们，不去为难他们。这样，我们就需要预先判断一下某个字符串在对方字符集下是否有效。如果是，就放心传吧，否则我们需要给一个对方可以理解的给他们。

字符串存储和传输时都只是一串字节，比如我们保存`中文`这两个汉字时，按UTF-8编码，保存的是`E4B8ADE69687`，如果按GBK编码保存，就是`D6D0CEC4`。

字符集，就是，在保存和发送时把文字编码成字节，又在读取和接收时把字节解码成文字，的一张映射表。

在Java里获取一个字符串的各种编码是很方便的，只要调用String类里的:

    byte[]  getBytes(Charset charset)

    Encodes this String into a sequence of bytes using the given charset, storing the result into a new byte array.

这里为了能显示字节，用了javax.xml.bind.DatatypeConverter类里的：

    printHexBinary(byte[] val) Converts an array of bytes into a string.

比如，

    String a = "中文";
    System.out.println (javax.xml.bind.DatatypeConverter.printHexBinary(a.getBytes("UTF-8")));
    System.out.println (javax.xml.bind.DatatypeConverter.printHexBinary(a.getBytes("GBK")));
    System.out.println (javax.xml.bind.DatatypeConverter.printHexBinary(a.getBytes("UTF-16BE")));

把一段字节按某个字符集解码成字符串在Java里也是相当方便的，只需要一个String类的构造函数：

    String(byte[] bytes, Charset charset)

    Constructs a new String by decoding the specified array of bytes using the specified charset.

比如，

    String a = "中文";
    byte[] aa = a.getBytes("GBK");
    System.out.println (new String(aa, "GBK"));

现在回到开头的问题，如何判断某个字符串在某个字符集下是否有效？结合我们刚刚对字符集的理解，只要该字符串在该字符集下能够成功的编码解码，该字符串在该字符集下就是有效的，而现在我们也有了字符串编码和解码的方法，事情就简单了。


    /*
    * 判断输入的字符串在某个字符集下是否有效
    */

    public static boolean isStringValidInCharset(String s, String charset) {
        try {
            // 获取字符串s在字符集charset下的编码
            byte[] bytes = s.getBytes(charset);
            // 把获得的编码按该字符集解码成新字符串
            String ss = new String(bytes, charset);
            // 解码出来的新字符串应该与原来相等
            // 如果s不是该字符集下有效的字符串，解码出来的会是一堆问号
            return s.equals(ss);
        } catch (UnsupportedEncodingException e) {
            return false;
        }
    }

    System.out.println(isStringValidInCharset("中文abc", "GBK"));
    System.out.println(isStringValidInCharset("å›¾ä¹¦", "GBK"));


完整的测试代码

    // javac test.java && java -cp . test
    import java.io.UnsupportedEncodingException;

    public class test {

        /*
        * 判断输入的字符串在某个字符集下是否有效
        */

        public static boolean isStringValidInCharset(String s, String charset) {
            try {
                // 获取字符串s在字符集charset下的编码
                byte[] bytes = s.getBytes(charset);
                // 把获得的编码按该字符集解码成新字符串
                String ss = new String(bytes, charset);
                // 解码出来的新字符串应该与原来相等
                // 如果s不是该字符集下有效的字符串，解码出来的会是一堆问号
                return s.equals(ss);
            } catch (UnsupportedEncodingException e) {
                return false;
            }
        }

        public static void main(String[] args) {

            String a = "中文";
            String b = "å›¾ä¹¦";

            try {
                System.out.println (System.getenv("LC_CTYPE"));

                System.out.println (isStringValidInCharset(a, "GBK"));
                System.out.println (isStringValidInCharset(b, "GBK"));

                byte[] aa = a.getBytes("GBK");
                System.out.println (javax.xml.bind.DatatypeConverter.printHexBinary(aa));
                System.out.println (new String(aa, "GBK"));

                byte[] ab = a.getBytes("UTF-8");
                System.out.println (javax.xml.bind.DatatypeConverter.printHexBinary(ab));
                System.out.println (new String(ab, "UTF-8"));

                System.out.println (javax.xml.bind.DatatypeConverter.printHexBinary(a.getBytes("UTF-16BE")));

            } catch (UnsupportedEncodingException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }

    }

运行结果：

    $ javac test.java && java -cp . test
    UTF-8
    true
    false
    D6D0CEC4
    中文
    E4B8ADE69687
    中文
    4E2D6587
