// =====================================
// SIWRAD TOOLKIT INDONESIA
// APP.JS V2.8 FINAL
// PART 1
// =====================================

// ================================
// ELEMENT
// ================================

const canvas = document.getElementById("waveCanvas");
const ctx = canvas.getContext("2d");

const splash = document.getElementById("splash");
const dashboard = document.getElementById("dashboard");
const calculator = document.getElementById("calculator");

const title = document.getElementById("title");

// ================================
// CANVAS
// ================================

function resizeCanvas(){

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();

// ================================
// WAVE ENGINE
// ================================

let t = 0;

let energy = -40;

let pulseLock = false;

const trails = [];

function waveY(x,amp){

    return canvas.height/2 +

    Math.sin(x*0.02+t)*amp;

}

function drawWave(amp,alpha,width){

    ctx.beginPath();

    for(let x=0;x<=canvas.width;x++){

        const y=waveY(x,amp);

        if(x===0){

            ctx.moveTo(x,y);

        }else{

            ctx.lineTo(x,y);

        }

    }

    ctx.strokeStyle=`rgba(0,217,255,${alpha})`;

    ctx.lineWidth=width;

    ctx.shadowColor="#00d9ff";

    ctx.shadowBlur=20;

    ctx.stroke();

}
// ================================
// ANIMATION ENGINE
// ================================

function animate(){

    if(splash.style.display==="none") return;

    ctx.clearRect(0,0,canvas.width,canvas.height);

    drawWave(20,0.20,1);
    drawWave(30,0.45,2);
    drawWave(40,1,3);

    const ex=energy;
    const ey=waveY(ex,40);

    trails.push({
        x:ex,
        y:ey,
        life:1
    });

    for(let i=trails.length-1;i>=0;i--){

        let p=trails[i];

        ctx.beginPath();
        ctx.arc(p.x,p.y,8*p.life,0,Math.PI*2);
        ctx.fillStyle=`rgba(0,217,255,${0.35*p.life})`;
        ctx.fill();

        p.life-=0.02;

        if(p.life<=0){

            trails.splice(i,1);

        }

    }

    ctx.beginPath();
    ctx.arc(ex,ey,6,0,Math.PI*2);
    ctx.fillStyle="#ffffff";
    ctx.shadowColor="#00d9ff";
    ctx.shadowBlur=35;
    ctx.fill();

    energy+=4;

    if(!pulseLock &&
       energy>canvas.width/2-10 &&
       energy<canvas.width/2+10){

        pulseLock=true;

        title.classList.add("pulse");

        setTimeout(()=>{

            title.classList.remove("pulse");

        },400);

    }

    if(energy>canvas.width+30){

        energy=-30;

        pulseLock=false;

    }

    t+=0.05;

    requestAnimationFrame(animate);

}

animate();

// ================================
// SPLASH TRANSITION
// ================================

setTimeout(()=>{

    splash.style.display="none";

    dashboard.classList.remove("hidden");

},5000);

// ================================
// NAVIGATION
// ================================

document.getElementById("btnCalc").addEventListener("click",function(){

    dashboard.classList.add("hidden");

    calculator.classList.remove("hidden");

});

document.getElementById("btnBack").addEventListener("click",function(){

    calculator.classList.add("hidden");

    dashboard.classList.remove("hidden");

});
// ================================
// PART 3A
// ELECTRICAL CALCULATOR ENGINE
// ================================

document.getElementById("btnHitung").addEventListener("click", function () {

    // ============================
    // AMBIL DATA INPUT
    // ============================

    const phase = document.getElementById("phase").value;

    const V = parseFloat(document.getElementById("volt").value);

    const I = parseFloat(document.getElementById("ampere").value);

    const L = parseFloat(document.getElementById("length").value);

    const PF = parseFloat(document.getElementById("pf").value);

    // ============================
    // VALIDASI
    // ============================

    if (isNaN(V) || isNaN(I) || isNaN(L) || isNaN(PF)) {

        alert("Lengkapi semua data terlebih dahulu.");

        return;

    }

    if (V <= 0 || I <= 0 || L < 0 || PF <= 0 || PF > 1) {

        alert("Data yang dimasukkan tidak valid.");

        return;

    }

    // ============================
    // PERHITUNGAN DAYA
    // ============================

    let VA = 0;

    if (phase === "1") {

        VA = V * I;

    } else {

        VA = 1.732 * V * I;

    }

    const W = VA * PF;

    // ============================
    // LANJUT KE PART 3B
    // ============================
      // ============================
    // SMART MCCB & SMART CABLE
    // ============================

    let mccb = "";
    let kabel = "";

    if (I <= 6) {

        mccb = "6 A";
        kabel = "1.5 mm²";

    }
    else if (I <= 10) {

        mccb = "10 A";
        kabel = "1.5 mm²";

    }
    else if (I <= 16) {

        mccb = "16 A";
        kabel = "2.5 mm²";

    }
    else if (I <= 20) {

        mccb = "20 A";
        kabel = "2.5 mm²";

    }
    else if (I <= 25) {

        mccb = "32 A";
        kabel = "4 mm²";

    }
    else if (I <= 32) {

        mccb = "40 A";
        kabel = "6 mm²";

    }
    else if (I <= 40) {

        mccb = "50 A";
        kabel = "10 mm²";

    }
    else if (I <= 63) {

        mccb = "63 A";
        kabel = "16 mm²";

    }
    else if (I <= 80) {

        mccb = "80 A";
        kabel = "25 mm²";

    }
    else if (I <= 100) {

        mccb = "100 A";
        kabel = "35 mm²";

    }
    else {

        mccb = "Perlu Analisa Engineering";
        kabel = "Perlu Analisa Engineering";

    }
      // ============================
    // SMART CABLE ANALYZER
    // ============================

    let voltageDrop = "";
    let cableAdvice = "";

    if (L <= 30) {

        voltageDrop = "< 3 %";
        cableAdvice = "Ukuran kabel masih sesuai.";

    }
    else if (L <= 50) {

        voltageDrop = "3 - 5 %";
        cableAdvice = "Pertimbangkan naik 1 ukuran kabel.";

    }
    else {

        voltageDrop = "> 5 %";
        cableAdvice = "Disarankan menaikkan ukuran kabel untuk mengurangi voltage drop.";

    }

    // ============================
    // POWER FACTOR ANALYZER
    // ============================

    let statusPF = "";

    if (PF >= 0.95) {

        statusPF = "🟢 Sangat Baik";

    }
    else if (PF >= 0.80) {

        statusPF = "🟡 Cukup";

    }
    else {

        statusPF = "🔴 Rendah";

    }

    // ============================
    // ANALISA BEBAN
    // ============================

    let analisaBeban = "";

    if (I < 16) {

        analisaBeban = "Instalasi termasuk beban ringan.";

    }
    else if (I < 32) {

        analisaBeban = "Instalasi termasuk beban menengah. Pastikan sambungan kabel baik.";

    }
    else if (I < 63) {

        analisaBeban = "Arus cukup besar. Periksa suhu kabel dan panel secara berkala.";

    }
    else {

        analisaBeban = "Arus tinggi. Disarankan dilakukan analisa engineering lebih lanjut.";

    }
      // ============================
    // HASIL PERHITUNGAN
    // ============================

    document.getElementById("hasil").innerHTML = `

<div class="resultCard">

<div class="resultTitle">
📋 Rekomendasi Lapangan
</div>

<div class="resultValue" style="font-size:20px">

🛡 MCCB : ${mccb}<br><br>

🧵 Kabel : ${kabel}<br><br>

📈 Power Factor : ${statusPF}

</div>

</div>

<div class="resultCard">

<div class="resultTitle">
⚡ Daya Semu
</div>

<div class="resultValue">

${VA.toFixed(2)} VA

</div>

</div>

<div class="resultCard">

<div class="resultTitle">
⚡ Daya Aktif
</div>

<div class="resultValue">

${W.toFixed(2)} Watt

</div>

</div>

<div class="resultCard">

<div class="resultTitle">
🔌 Arus
</div>

<div class="resultValue">

${I.toFixed(2)} A

</div>

</div>

<div class="resultCard">

<div class="resultTitle">
⚡ Tegangan
</div>

<div class="resultValue">

${V.toFixed(0)} Volt

</div>

</div>

<div class="analysisCard">

<div class="analysisTitle">

📋 Analisa Teknisi

</div>

<div class="analysisText">

✅ MCCB Disarankan :
<b>${mccb}</b>

<br><br>

✅ Kabel Disarankan :
<b>${kabel}</b>

<br><br>

📏 Panjang Kabel :
<b>${L} Meter</b>

<br><br>

📉 Estimasi Voltage Drop :
<b>${voltageDrop}</b>

<br><br>

🧵 Analisa Kabel :

${cableAdvice}

<br><br>

✅ Status Power Factor :
<b>${statusPF}</b>

<br><br>

💡 Analisa :

${analisaBeban}

</div>

</div>

`;
  // ================================
// POWER FACTOR SELECTOR
// ================================

});

const pfInput = document.getElementById("pf");

document.querySelectorAll('input[name="pfSelect"]').forEach(radio=>{

    radio.addEventListener("change",function(){

        if(this.value==="manual"){

            pfInput.disabled=false;

            pfInput.value="";

            pfInput.focus();

        }else{

            pfInput.disabled=true;

            pfInput.value=this.value;

        }

    });

});

// ================================
// DEFAULT VALUE
// ================================

pfInput.value="0.80";

pfInput.disabled=true;

// ================================
// END OF APP.JS V2.8 FINAL
// ================================