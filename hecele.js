const SHY = '\u00AD';  // soft hyphen
const HRD = '\u2010';  // hard hyphen
const kurallar = [
  { ptn: /^[aeiouöüıİ][bcçdfgğhjklmnprsştvyz][aeiouöüıİ]/i,    len: 1}, // 2.
  { ptn: /^[aeiouöüıİ]{2}[bcçdfgğhjklmnprsştvyz]/i,            len: 1}, // 3.
  { ptn: /^[bcçdfgğhjklmnprsştvyz][aeiouöüıİ]{2}/i,            len: 2}, // 4.
  { ptn: /^[aeiouöüıİ][bcçdfgğhjklmnprsştvyz]{2}[aeiouöüıİ]/i, len: 2}, // 5.
  { ptn: /^([bcçdfgğhjklmnprsştvyz][aeiouöüıİ]){2}/i,          len: 2}, // 6.
  { ptn: /^[aeiouöüıİ][bcçdfgğhjklmnprsştvyz]{2}($|[bcçdfgğhjklmnprsştvyz])/i, len: 3},        // 7.
  { ptn: /^[bcçdfgğhjklmnprsştvyz][aeiouöüıİ][bcçdfgğhjklmnprsştvyz]($|[bcçdfgğhjklmnprsştvyz][aeiouöüıİ])/i, len: 3},    // 8.
  { ptn: /^[bcçdfgğhjklmnprsştvyz]{2}[aeiouöüıİ][bcçdfgğhjklmnprsştvyz][aeiouöüıİ]/i, len: 3}, // 9.
  { ptn: /^[bcçdfgğhjklmnprsştvyz][aeiouöüıİ][bcçdfgğhjklmnprsştvyz]{2}($|[bcçdfgğhjklmnprsştvyz])/i, len: 4},            // 10.
  { ptn: /^[bcçdfgğhjklmnprsştvyz]{2}[aeiouöüıİ][bcçdfgğhjklmnprsştvyz]($|[bcçdfgğhjklmnprsştvyz][aeiouöüıİ])/i, len: 4}, // 11.
  { ptn: /^[bcçdfgğhjklmnprsştvyz]{2}[aeiouöüıİ][bcçdfgğhjklmnprsştvyz]{2}($|[bcçdfgğhjklmnprsştvyz])/i, len: 5}          // 12.
];

const ozl = [
  /* Dikkat: bu liste alfabetik sırada olmalı */
  { s: 'demirspor',    len: 5},
  { s: 'dışişler',     len: 3},
  { s: 'elektrik',     len: 4},
  { s: 'elektronik',   len: 4},
  { s: 'endüstri',     len: 5},
  { s: 'halkoy',       len: 4},
  { s: 'içişler',      len: 2},
  { s: 'kangren',      len: 3},
  { s: 'kontrol',      len: 3},
  { s: 'popstar',      len: 3},
  { s: 'santral',      len: 3},
  { s: 'şokokrem',     len: 4},
  { s: 'trabzonspor',  len: 7},
  { s: 'vanspor',      len: 3}
];

function hecele(szck, tire = SHY)
{
  let r;
  for (const o of ozl) {
    r = szck.slice(0, o.s.length).localeCompare(o.s, 'tr', {sensitivity: "base"});
    if (r == 0)
      return `${seslemle(szck.slice(0, o.len), tire)}${tire}${seslemle(szck.slice(o.len), tire)}`;
    else if (r < 0)
      break;
  }

  return seslemle(szck, tire);
}

function seslemle(szck, tire)
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
