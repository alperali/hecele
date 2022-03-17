[*(This content is also available in English)*](README_EN.md)  
# Türkçe Heceleme
Bu proje, sözlük veri tabanı gerektirmeyen, algoritmik bir heceleme yönteminin anlatımı ve uygulamasıdır.[^1]

![Demo animasyonu](./demo.gif)


## [>> Demo için tıklayın](https://alperali.github.io/hecele/)
> Demo için güncel bir Chrome, Edge, Firefox, vs sürümü kullanın.

## [>> Demo 2](https://alperali.github.io/hecele/seslemle.html)
> Kendi girdiğiniz metinin hecelenişini görmek içindir. Bir sözcük veya
> kısa metin girip `Hecele`ye tıklayın. Tireleri silmek için `Geri al`ı tıklayın.

---

## Giriş
Basit ve yalın bir morfolojik yapısı olan Türkçede heceleme (*hyphenation*) Hint-Avrupa dillerindekinden farklıdır.
Bitişken (*agglutinative*) bir dil olan Türkçede teorik olarak sözcük uzunluğunun bir üst sınırının olmaması, sözlük veri tabanı kullanımını (*dictionary lookup*) anlamsız kılar.
O dillere göre tasarlanmış yazılım ve/veya kütüphanelere Türkçeyi eklemeye çalışmak yerine özgün ve rasyonel bir yaklaşım mümkündür. Türkçe heceleme deterministiktir, sade ve açık kurallar ile formüle edilebilir.

## Bulgular
Türkçe üzerine birinci bulgu:

    Türkçe sözcükteki bir hecenin yeri, kendinden önce gelen hecelerden bağımsızdır.

Bu çok iddialı gibi görünen bulguyu açıklayan bir örnek verelim:

| sözcük | hecelenişi |
| --- | --- |
| `arkadaşlarından` | `ar-ka-daş-la-rın-dan` |

Şimdi bu sözcüğün sadece ilk hecesini bulalım, sonra o heceyi sözcükten ayıralım:

| ilk hece | kalanı |
| --- | --- |
| `ar-kadaşlarından` | `kadaşlarından` |

Geriye kalan **kadaşlarından** anlamlı bir Türkçe sözcük değil, ancak hecelenmesine engel bir durum yok. İlkokul 1. sınıf bilgimizi kullanarak bu sözcük parçasının ilk hecesini bulalım, sonra gene bu heceyi ayıralım:

| ilk hece | kalanı |
| --- | --- |
| `ka-daşlarından` | `daşlarından` |

Görüldüğü üzere **ka-** hecesini, öncesinde **ar-** olup olmadığını hesaba katmadan doğru olarak bulabiliyoruz. İşte bir hece yerinin, önceki hecelerden bağımsızlığı ilkesi budur.  
Sözcük parçasının sonuna ulaşana kadar işleme devam edelim:

| ilk hece | kalanı |
| --- | --- |
| `daş-larından` | `larından` |
| `la-rından` | `rından` |
| `rın-dan` | `dan` |
| `dan` | - |

Bu aşamada Türkçe üzerine ikinci bir bulguyu belirtelim:

    Türkçede henüz bilinmeyen, icat edilmemiş sözcüklerin bile nasıl heceleneceği bellidir.

---
Çözümün algoritmik çatısı şöyledir:
**Sözcükte ilk heceyi bul, bunu ayır, kalanı yeni bir sözcükmüş gibi ele al, ilk hecesini bul, bunu ayır, kalanı yeni bir sözcükmüş gibi... ta ki sözcük bitene kadar.** Bu tipik bir özyinelemeli (*recursive*) algoritmadır. Bu aşamada problemi “bir sözcüğün (veya sözcük parçasının) ilk hecesinin bulunması”na indirgemiş olduk. Sonraki bölümde bunu ele alacağız.

## İlk Hece Kuralları
Bu bölümde bir sözcük (veya sözcük parçasının) ilk hecesini bulan kurallar belirtilmektedir.
Kurallara sırayla bakılacak ve uyan ilk kural heceyi bulmuş kabul edilecek, sonraki kurallara bakılmayacaktır.
Her kuralda sözel anlatımı takiben örnekler, simgesel gösterim ve heceyi saptayan bir RegEx örüntü (*pattern*) verilmiştir.[^2]
Sözel anlatımda geçen “sözcük” terimi “sözcük veya sözcük parçası” anlamındadır.
Simgesel gösterimde **N** ünlü, **z** ünsüzü temsil eder.
Kolaylık sağlaması için sözcükte noktalama imleri ve rakamlar olmadığı varsayılmıştır.

1. **Sözcük 3 harften kısa ise ilk hece sözcüğün tamamıdır.**

   <table role="table">
     <tr>
       <td>
         <em>ev<br />şu<br />il<br />at</em>
       </td>
       <td> - </td>
     </tr>
     <tr></tr> <!-- suppress stripe -->
     <tr>
       <td colspan="2"><code> - </code></td>
     </tr>
   </table>

2. **Sözcük ünlü-ünsüz-ünlü olarak başlıyorsa ilk hece 1 harftir.**

   <table role="table">
     <tr>
       <td>
         <em>ö-de-me<br />i-liş-kin<br />e-mir<br />a-ra</em>
       </td>
       <td> NzN :1 </td>
     </tr>
     <tr></tr> <!-- suppress stripe -->
     <tr>
       <td colspan="2"><code>/^[aeiouöüıİ][bcçdfgğhjklmnprsştvyz][aeiouöüıİ]/i</code></td>
     </tr>
   </table>

3. **Sözcük ünsüz-ünlü-ünlü olarak başlıyorsa ilk hece 2 harftir.**

   <table role="table">
     <tr>
       <td>
         <em>sa-at-ler<br />fi-il<br />ka-i-de<br />me-sa-i</em>
       </td>
       <td> zNN :2 </td>
     </tr>
     <tr></tr> <!-- suppress stripe -->
     <tr>
       <td colspan="2"><code>/^[bcçdfgğhjklmnprsştvyz][aeiouöüıİ]{2}/i</code></td>
     </tr>
   </table>

4. **Sözcük ünlü-ünsüz-ünsüz-ünlü olarak başlıyorsa ilk hece 2 harftir.**

   <table role="table">
     <tr>
       <td>
         <em>em-ri-ne<br />iş-le-min<br />ak-tar-ma</em>
       </td>
       <td> NzzN :2 </td>
     </tr>
     <tr></tr> <!-- suppress stripe -->
     <tr>
       <td colspan="2"><code>/^[aeiouöüıİ][bcçdfgğhjklmnprsştvyz]{2}[aeiouöüıİ]/i</code></td>
     </tr>
   </table>

5. **Sözcük ünsüz-ünlü-ünsüz-ünlü olarak başlıyorsa ilk hece 2 harftir.**

   <table role="table">
     <tr>
       <td>
         <em>ve-rir<br />ta-li-mat<br />ma-hi-ye-ti-ne</em>
       </td>
       <td> zNzN :2 </td>
     </tr>
     <tr></tr> <!-- suppress stripe -->
     <tr>
       <td colspan="2"><code>/^([bcçdfgğhjklmnprsştvyz][aeiouöüıİ]){2}/i</code></td>
     </tr>
   </table>

6. **Sözcük ünlü-ünsüz-ünsüz-ünsüz olarak başlıyorsa ilk hece 3 harftir.**  
   **Sözcük ünlü-ünsüz-ünsüz olarak tam 3 harf ise ilk hece sözcüğün tamamıdır.**

   <table role="table">
     <tr>
       <td>
         <em>ilk-ba-har<br />üst-te-ki<br />alt-lık<br />ilk<br />alt<br />üst</em>
       </td>
       <td> Nzzz :3<br />Nzz. :3 </td>
     </tr>
     <tr></tr> <!-- suppress stripe -->
     <tr>
       <td colspan="2"><code>/^[aeiouöüıİ][bcçdfgğhjklmnprsştvyz]{2}($|[bcçdfgğhjklmnprsştvyz])/i</code></td>
     </tr>
   </table>

7. **Sözcük ünsüz-ünlü-ünsüz-ünsüz-ünlü olarak başlıyorsa ilk hece 3 harftir.**  
   **Sözcük ünsüz-ünlü-ünsüz olarak tam 3 harf ise ilk hece sözcüğün tamamıdır.**

   <table role="table">
     <tr>
       <td>
         <em>bil-gi<br />müş-te-ri<br />sağ-lam<br />son<br />kal<br />gel</em>
       </td>
       <td> zNzzN :3<br />zNz. :3 </td>
     </tr>
     <tr></tr> <!-- suppress stripe -->     
     <tr>
       <td colspan="2"><code>/^[bcçdfgğhjklmnprsştvyz][aeiouöüıİ][bcçdfgğhjklmnprsştvyz]($|[bcçdfgğhjklmnprsştvyz][aeiouöüıİ])/i</code></td>
     </tr>
   </table>

8. **Sözcük ünsüz-ünsüz-ünlü-ünsüz-ünlü olarak başıyorsa ilk hece 3 harftir.**

   <table role="table">
    <tr>
      <td>
        <em>pro-je<br/>kra-li-çe<br/>tra-fo<br/>pro-fes-yo-nel</em>
      </td>
      <td> zzNzN :3 </td>
    </tr>
    <tr></tr> <!-- suppress stripe -->
    <tr>
      <td colspan="2"><code>/^[bcçdfgğhjklmnprsştvyz]{2}[aeiouöüıİ][bcçdfgğhjklmnprsştvyz][aeiouöüıİ]/i</code>
      </td>
    </tr>
   </table>

9. **Sözcük ünsüz-ünlü-ünsüz-ünsüz-ünsüz olarak başlıyorsa ilk hece 4 harftir.**  
   **Sözcük ünsüz-ünlü-ünsüz-ünsüz olarak tam 4 harf ise ilk hece sözcüğün tamamıdır.**

   <table role="table">
     <tr>
       <td>
         <em>borç-lan-mak<br />fark-lı-laş-tır<br />kont-rol<br />kang-ren<br/>mert<br />hurç<br />Türk<br/>sant-ral</em>
       </td>
       <td> zNzzz :4<br />zNzz. :4 </td>
     </tr>
     <tr></tr> <!-- suppress stripe -->     
     <tr>
       <td colspan="2"><code>/^[bcçdfgğhjklmnprsştvyz][aeiouöüıİ][bcçdfgğhjklmnprsştvyz]{2}($|[bcçdfgğhjklmnprsştvyz])/i</code></td>
     </tr>
   </table>

10. **Sözcük ünsüz-ünsüz-ünlü-ünsüz-ünsüz-ünlü olarak başlıyorsa ilk hece 4 harftir.**  
    **Sözcük ünsüz-ünsüz-ünlü-ünsüz olarak tam 4 harf ise ilk hece sözcüğün tamamıdır.**

    <table role="table">
      <tr>
        <td>
          <em>prog-ram-cı<br />Trak-ya<br />spor<br />tren</em>
        </td>
        <td> zzNzzN :4<br/>zzNz. :4</td>
      </tr>
      <tr></tr> <!-- suppress stripe -->
      <tr>
        <td colspan="2"><code>/^[bcçdfgğhjklmnprsştvyz]{2}[aeiouöüıİ][bcçdfgğhjklmnprsştvyz]($|[bcçdfgğhjklmnprsştvyz][aeiouöüıİ])/i</code></td>
      </tr>
    </table>

11. **Sözcük ünsüz-ünsüz-ünlü-ünsüz-ünsüz-ünsüz olarak başlıyorsa ilk hece 5 harftir.**  
    **Sözcük ünsüz-ünsüz-ünlü-ünsüz-ünsüz olarak tam 5 harf ise ilk hece sözcüğün tamamıdır.**

    <table role="table">
      <tr>
        <td>
          <em>prens<br/>trend<br/>trans<br/>prens-ler<br/>trans-for-mas-yon</em>
        </td>
        <td> zzNzzz :5<br/>zzNzz. :5</td>
      </tr>
      <tr></tr> <!-- suppress stripe -->
      <tr>
        <td colspan="2"><code>/^[bcçdfgğhjklmnprsştvyz]{2}[aeiouöüıİ][bcçdfgğhjklmnprsştvyz]{2}($|[bcçdfgğhjklmnprsştvyz])/i</code></td>
      </tr>
    </table>

## Kullanım ve Uygulama
Bu çalışma standart web teknolojilerini baz almaktadır (gerekirse şirkete/markaya özel teknolojilere uyarlanabilir).
Bu bağlamda CSS *hyphens property* odaklı bir uygulama yapılmıştır.[^3]
Elektronik belgelerin düzgün gösterimi (satır sonu doğru yerde bölme) için tire olarak U+00AD (gizli tire / *soft hyphen*),
tüm hecelerin açıkça gösterimi için tire olarak U+2010 (açık tire / *hard hyphen*) kullanılmaktadır.
Yukarıda bahsedilen 11 kurala göre heceleme yapan ve tire türünü (gizli veya açık) argüman olarak alabilen örnek bir Javascript modülü aşağıda gösterilmiştir.

```javascript
const SHY = '\u00AD';  // gizli tire (soft hyphen)
const HRD = '\u2010';  // açık tire  (hard hyphen)
const kurallar = [
  { ptn: /^[aeiouöüıİ][bcçdfgğhjklmnprsştvyz][aeiouöüıİ]/i,    len: 1}, // 2.
  { ptn: /^[bcçdfgğhjklmnprsştvyz][aeiouöüıİ]{2}/i,            len: 2}, // 3.
  { ptn: /^[aeiouöüıİ][bcçdfgğhjklmnprsştvyz]{2}[aeiouöüıİ]/i, len: 2}, // 4.
  { ptn: /^([bcçdfgğhjklmnprsştvyz][aeiouöüıİ]){2}/i,          len: 2}, // 5.
  { ptn: /^[aeiouöüıİ][bcçdfgğhjklmnprsştvyz]{2}($|[bcçdfgğhjklmnprsştvyz])/i, len: 3},        // 6.
  { ptn: /^[bcçdfgğhjklmnprsştvyz][aeiouöüıİ][bcçdfgğhjklmnprsştvyz]($|[bcçdfgğhjklmnprsştvyz][aeiouöüıİ])/i, len: 3},    // 7.
  { ptn: /^[bcçdfgğhjklmnprsştvyz]{2}[aeiouöüıİ][bcçdfgğhjklmnprsştvyz][aeiouöüıİ]/i, len: 3}, // 8.
  { ptn: /^[bcçdfgğhjklmnprsştvyz][aeiouöüıİ][bcçdfgğhjklmnprsştvyz]{2}($|[bcçdfgğhjklmnprsştvyz])/i, len: 4},            // 9.
  { ptn: /^[bcçdfgğhjklmnprsştvyz]{2}[aeiouöüıİ][bcçdfgğhjklmnprsştvyz]($|[bcçdfgğhjklmnprsştvyz][aeiouöüıİ])/i, len: 4}, // 10.
  { ptn: /^[bcçdfgğhjklmnprsştvyz]{2}[aeiouöüıİ][bcçdfgğhjklmnprsştvyz]{2}($|[bcçdfgğhjklmnprsştvyz])/i, len: 5}          // 11.
];

function hecele(szck, tire = SHY)
{
  if (szck.length < 3)        // 1.
    return szck;

  for (const kural of kurallar)
    if (kural.ptn.test(szck))
      if (szck.length > kural.len)
        return `${szck.slice(0, kural.len)}${tire}${hecele(szck.slice(kural.len), tire)}`;
      else
        return szck;
    
  return szck;   // hiçbiri uymadı, aynen döndür.
}

Object.defineProperty(hecele, 'SHY', { value: SHY});
Object.defineProperty(hecele, 'HRD', { value: HRD});

export default hecele;
```

### Belge üzerinde kullanım
Heceleme modülü noktalama imleri içermeyen tek sözcük üzerinde çalışmaktadır.
Tüm bir belgenin bu modülden fayda sağlaması için noktalama imleri atlanarak sözcükler sırayla bu modüle gönderilmeli,
tireler yerleştirilmiş sözcükler noktalama imlerini kaybetmeden ve orjinal sırasında belge
içerisine geri konulmalıdır (veya yeni bir belge oluşturulmalıdır). Bu işlemi gösteren örnek bir
Javascript bloğu şöyle olabilir:

```javascript
const nokim = /([\s\u00AD\u2010,;:.'"’“”!?\/()-]+)/;  /* noktalama imleri örüntüsü */
belge.split(nokim)
     .map((e) => {
        if (nokim.test(e)) return e;
        return hecele(e, hecele.SHY);
      })
     .join("");
```
#### 12. kural
> Ayırmada satır sonunda ve satır başında tek harf bırakılmaz[^4]

Bu duruma uyan harfler 2. ve 3. kurallarda gözlenir, örneğin `ö-deme` ve `mesa-i`.
Her iki durumda da tek kalan harf bir ünlüdür.
Bu kuralı uygulamak için hecelenmiş sözcüğün ilk ve son tirelerine bakılır,
öncesinde veya sonrasında tek bir ünlü varsa bu tire kaldırılır, böylece satır sonunda ayırma engellenir.

```javascript
const nokim = /([\s\u00AD\u2010,;:.'"’“”!?\/()-]+)/;  /* noktalama imleri örüntüsü */
const k10 = /^([aeiouöüıİ])[\u00AD\u2010]|[\u00AD\u2010]([aeiouöüıİ])$/gi;  // 11.
belge.split(nokim)
     .map((e) => {
        if (nokim.test(e)) return e;
        return hecele(e, hecele.SHY).replace(k10, '$1$2');
      })
     .join("");
```

## Özel durumlar (birleşik sözcükler)
> İlk heceden sonraki heceler ünsüzle başlar. Bitişik yazılan kelimelerde de bu kurala uyulur:
> *ba-şöğ-ret-men, il-ko-kul, Ka-ra-os-ma-noğ-lu* vb.[^4]

<table role="table">
  <tr><th></th><th style="text-align: center">A</th><th style="text-align: center">B</th></tr>
  <tr><td>İçişleri</td><td><em>İ-çiş-le-ri</em></td><td><em>İç-iş-le-ri</em></tr>
  <tr><td>Kızılırmak</td><td><em>Kı-zı-lır-mak</em></td><td><em>Kı-zıl-ır-mak</em></td></tr>
  <tr><td>başüstüne</td><td><em>ba-şüs-tü-ne</em></td><td><em>baş-üs-tü-ne</em></td></tr>
  <tr><td>keloğlan</td><td><em>ke-loğ-lan</em></td><td><em>kel-oğ-lan</em></td></tr>
  <tr><td>ilkokul</td><td><em>il-ko-kul</em></td><td><em>ilk-o-kul</em></td></tr>
  <tr><td>başöğretmen</td><td><em>ba-şöğ-ret-men</em></td><td><em>baş-öğ-ret-men</em></td></tr>
  <tr><td>yayınevi</td><td><em>ya-yı-ne-vi</em></td><td><em>ya-yın-e-vi</em></td></tr>
  <tr><td>konukevi</td><td><em>ko-nu-ke-vi</em></td><td><em>ko-nuk-e-vi</em></td></tr>
  <tr><td>seçal</td><td><em>se-çal</em></td><td><em>seç-al</em></td></tr>
  <tr><td>eloğlu</td><td><em>e-loğ-lu</em></td><td><em>el-oğ-lu</em></td></tr>
  <tr><td>çapanoğlu<br/>kavuniçi<br/>tavşanağzı<br/>Büyükayı<br/>Küçükayı<br/>başeser<br/>
      akağaç<br/>ilköğretim<br/>huzurevi<br/>bakımevi<br/>gözlemevi<br/>doğumevi<br/>aşevi<br/>Eminönü<br/>
      aslanağzı<br/>açıkağız<br/>şeytanarabası<br/>meryemana<br/>hafızali<br/>çadıruşağı<br/>
      Alper<br/>Gökalp<br/>Şenol<br/>Varol<br/>Birol<br/>
      horozayağı<br/>beşikörtüsü<br/>pekala<br/>apaçık
    </td><td><em></em></td><td><em></em></td>
  </tr>
</table>

Yukarıdaki tabloda gösterilen birleşik sözcükler heceleme modülü tarafından **A** sütunundaki
gibi hecelenmektedir. Türk Dil Kurumu da böyle hecelenmesi gerektiğini sitesinde belirtmiştir.
Eğer bu sonucu tatmin edici buluyorsanız bundan sonrasını okumanıza gerek yoktur.
Fakat bu sözcüklerin **B** sütunundaki gibi hecelenmesinin daha doğru olduğu ve sonucun
öyle olması gerektiği görüşündeyseniz, yazının devamı bu durumu ele alacak ve bir çözüm önerecektir.


## Başarım


[^1]: Bu anlatım [2016’da yapılmış bir çalışmaya](https://github.com/alperali/jsders/blob/6fe279dcfe836bf6c98fd04a6403281414f4d57f/hecele.js) dayanmaktadır.

[^2]: Örüntüler standart Javascript RegEx nesnesini baz alır. Sistem *locale* ayarlarına göre değişkenlik gösterdiği için *character class* ve *range* kullanımı tercih edilmemiştir.

[^3]: https://developer.mozilla.org/en-US/docs/Web/CSS/hyphens

[^4]: https://www.tdk.gov.tr/icerik/yazim-kurallari/hece-yapisi-ve-satir-sonunda-kelimelerin-bolunmesi/
