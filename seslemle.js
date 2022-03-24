const f = (e) => document.getElementById(e);
import hecele from './hecele.js';
const nokim = /([\s\u00AD\u2010,;:.'"’“”!?\/()-]+)/;

f('gerial').addEventListener('click', () => {
    f('metin').value = f('metin').value.replace(/[\u00AD\u2010]/g, '');
});

f('clr').addEventListener('click', () => {
    f('metin').value = '';
});
const k13 = /^([aeiouöüıİ])[\u00AD\u2010]|[\u00AD\u2010]([aeiouöüıİ])$/gi;
f('hecele').addEventListener('click', () => {
    f('metin').value = f('metin').value.split(nokim)
                                 .map((e) => {
                                    if (nokim.test(e)) return e;
                                    let v = hecele(e, f('hrd').checked ? hecele.HRD : hecele.SHY);
                                    return f('k13').checked ? v.replace(k13, '$1$2') : v;
                                    })
                                 .join('');
});
