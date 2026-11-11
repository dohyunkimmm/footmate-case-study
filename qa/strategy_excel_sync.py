#!/usr/bin/env python3
"""Preserve original Excel financial model and append source-linked investment/strategy worksheets.

Existing worksheets, cell formulas, cached values, chart/relationship parts are unchanged.
The only existing workbook-wide style change normalizes font faces to Pretendard.
No generated plan value is presented as realized customer, contract, or sales results.
"""
from __future__ import annotations
import hashlib, math, os, re, sys, tempfile
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
from xml.etree import ElementTree as ET

M="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
O="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
P="http://schemas.openxmlformats.org/package/2006/relationships"
C="http://schemas.openxmlformats.org/package/2006/content-types"
ET.register_namespace("",M)
ET.register_namespace("r",O)
def tag(ns,name): return "{"+ns+"}"+name
def q(n): return tag(M,n)
def f(expr,val): return ("formula",expr,val)
def inp(v): return ("input",v)
def pct(v): return ("percent",v)
def put(d,a,v,sty=None): d[a]=(v,sty)
def sheeting(name,lead,headers,widths):
    d={}
    put(d,"A1",name,"title")
    put(d,"A2",lead,"note")
    for j,t in enumerate(headers):
        put(d,chr(65+j)+"4",t,"head")
    return {"name":name,"cells":d,"widths":widths}

def footmate_specs():
    # Input links are the existing public 2027 workbook: 가정!B6:B22.
    b=sheeting("전략가정","기존 가정과 연결 · 계획 시나리오 / 2년 차부터 수수료 협상안 적용",
               ["계획 변수","기준값","근거 / 적용 기준"],[37,21,65])
    vals=[
       ("2년 차 이후 수수료율",pct(.12),"제휴 조건 협상안 / 기존 가정 수수료 10%와 구분"),
       ("2년 차 이후 플랫폼 결제비율",pct(0),"결제비 운영자 부담 협상안"),
       ("월 환산 주수",inp(4.33),"기존 월별손익 시트의 4.33주 환산과 동일"),
       ("기본 공급처 초과 월 관리비",inp(30000),"공급처 5곳 초과 시 1곳당 추가 가정"),
       ("기존 공급처 수",f("'가정'!B20",5),"원본 가정 시트 연결"),
       ("기존 수수료율",f("'가정'!B7",.10),"원본 가정 시트 연결"),
       ("기존 결제비율",f("'가정'!B8",.03),"원본 가정 시트 연결"),
       ("월 고정비+인력 기회비용",f("'가정'!B13+'가정'!B14",2600000),"현금 고정비 60만+인력 기회비용 200만"),
       ("참가비",f("'가정'!B6",12000),"원본 가정 시트 연결"),
       ("건당 지원·IT·혼합 획득비",f("'가정'!B9+'가정'!B10+'가정'!B11*'가정'!B12",500),"150+50+0.5×600원"),
       ("초기 투자",f("'가정'!B19",3000000),"원본 300만 원 · 월 기회비용과 별개") ]
    for row,(label,v,src) in enumerate(vals,5):
        for col,value in [("A",label),("B",v),("C",src)]:put(b["cells"],f"{col}{row}",value,"text" if col!="B" else None)
    d=sheeting("5개년경영계획","1년 차 기존 조건 / 2~5년 차 협상안 · 월별 정상상태 경제적 손익 / 기존 PPT 연간 현금수지와 다른 기준",
               ["연차","공급처(곳)","월 완료(건)","수수료율","건당 공헌(원)","월 공헌(원)","월 총비용(원)","월 경제적 손익(원)","월 현금 손익(원)","연환산 경제손익(원)","전략 과제","PPT 연간 투자후 현금수지(원)"],
               [10,16,18,15,19,21,21,24,23,25,55,29])
    phase=[(1,5,"핵심 지역 공급·완료 예약 관리",-8150000),
           (2,12,"계약 조건 개선·인접 생활권 확대",6220000),
           (3,20,"재참가·공급 유지·운영 표준화",14150000),
           (4,28,"추가 관리비 반영 손익 및 자원 배분",22070000),
           (5,36,"권역별 확장·IT 투자·현금수지 관리",29980000)]
    counts=[626,1502,2504,3506,4507]
    margins=[340,940,940,940,940]
    expenses=[2600000,2810000,3050000,3290000,3530000]
    for i,(year,partners,mission,ppt_cash) in enumerate(phase):
        r=5+i
        cells={
            "A":year,"B":inp(partners),
            "C":f(f"ROUND(B{r}*'가정'!$B$15*'전략가정'!$B$7*'가정'!$B$16*'가정'!$B$21*'가정'!$B$22*(1-'가정'!$B$17)*'가정'!$B$18,0)",counts[i]),
            "D":f(f"IF(A{r}=1,'가정'!$B$7,'전략가정'!$B$5)",.1 if year==1 else .12),
            "E":f(f"'가정'!$B$6*(D{r}-IF(A{r}=1,'가정'!$B$8,'전략가정'!$B$6))-'가정'!$B$9-'가정'!$B$10-'가정'!$B$11*'가정'!$B$12",margins[i]),
            "F":f(f"C{r}*E{r}",counts[i]*margins[i]),
            "G":f(f"'가정'!$B$13+'가정'!$B$14+MAX(0,B{r}-'가정'!$B$20)*'전략가정'!$B$8",expenses[i]),
            "H":f(f"F{r}-G{r}",counts[i]*margins[i]-expenses[i]),
            "I":f(f"H{r}+'가정'!$B$14",counts[i]*margins[i]-expenses[i]+2000000),
            "J":f(f"H{r}*12",(counts[i]*margins[i]-expenses[i])*12),
            "K":mission,"L":inp(ppt_cash)}
        for col,v in cells.items():put(d["cells"],f"{col}{r}",v)
    put(d["cells"],"A11","중요: L열은 기존 발표자료 9장의 연간 투자 후 현금수지. 월 정상상태 경제손익 H열 또는 I열과 직접 비교하지 않음.","note")
    put(d["cells"],"A12","L열에는 연차별 투자비·사업 확대 시간표가 반영돼 있습니다. H/J열은 동일 월 조건을 12개월 지속한 민감도 비교값입니다.","note")
    put(d["cells"],"A13","월 경제적 손익은 인력 기회비용을 포함합니다. I열 월 현금 손익은 기회비용 제외, 초기 설비 투자비는 별도입니다.","note")
    k=sheeting("전략KPI","연간 계획·가상 거래·중장기 전략 목표를 구분해 관리",
        ["관리 항목","산정 값 / 정의","관리 주기","투자 판단 / 연동 위치"],[36,39,17,74])
    r=[
        ("2027년 계획 매출(원)",f("'운영보고'!B6",18232800),"연간","기존 운영보고 연결"),
        ("2027년 가상 수수료 매출(원)",f("'운영보고'!C6",18681100),"연간","기존 운영보고 연결"),
        ("2027년 가상 매출 계획 대비 차이(원)",f("'운영보고'!C6-'운영보고'!B6",448300),"연간","연중 가상 거래와 계획 비교"),
        ("2027년 가상 운영손익 차이(원)",f("'운영보고'!C7-'운영보고'!B7",-2806690),"분기/연간","기존 운영보고 연결"),
        ("28개 공급처 경제적 월 손익(원)",f("'5개년경영계획'!H8",5640),"월","공급처 확대·수익성 개선 기준"),
        ("5년 차 제휴 공급처(계획)",f("'5개년경영계획'!B9",36),"연간","공급처 확대 로드맵"),
        ("원장 수수료 대조",f("'검증'!B6","원장 입력 후 확인"),"월","원장 등록 전 합성 집계를 실적으로 간주하지 않음"),
        ("공급 운영","공급 유지율·완료 예약·취소율","월","공급 부족·취소 증가 시 제휴 계약 및 운영 조정"),
        ("고객 수요","30일 재참가율","월/분기","마케팅 비용·유입 경로 배분 판단"),
        ("개발 투자","기능별 구축·유지비와 절감 효과","분기","수익성·품질 관리와 연계해 투자 순서 결정")]
    for row,(name,value,cycle,judgement) in enumerate(r,5):
        for col,v in zip("ABCD",[name,value,cycle,judgement]):put(k["cells"],f"{col}{row}",v)
    v=sheeting("교차검증","웹 본문·발표자료·엑셀의 수치 및 거래 원장 입력 상태 분리",
        ["검증 대상","모델 산출","대조 기준","상태"],[44,26,33,22])
    cases=[
        ("초기 월 완료 예약",f("'5개년경영계획'!C5",626),626),
        ("초기 건당 공헌이익",f("'5개년경영계획'!E5",340),340),
        ("초기 월 경제적 손익",f("'5개년경영계획'!H5",-2387160),-2387160),
        ("28개 공급처 월 경제적 손익",f("'5개년경영계획'!H8",5640),5640),
        ("5년 차 공급처 확대 계획",f("'5개년경영계획'!B9",36),36)]
    for row,(label,val,expected) in enumerate(cases,5):
        put(v["cells"],f"A{row}",label)
        put(v["cells"],f"B{row}",val)
        put(v["cells"],f"C{row}",expected)
        put(v["cells"],f"D{row}",f(f'IF(B{row}=C{row},"일치","확인 필요")',"일치"))
    put(v["cells"],"A11","예약별 원장 데이터 검증","head")
    put(v["cells"],"B11",f("'검증'!B6","원장 입력 후 확인"))
    put(v["cells"],"A12","입력 전에는 원장 대사 완료로 표시하지 않음. 원본 검증 탭의 수식은 모두 보존.","note")
    put(v["cells"],"A13","원본 6개 시트의 2027년 계획·합성 자료와 중장기 시나리오를 혼동하지 않습니다.","note")
    put(v["cells"],"A14","기존 '36개월 TCO'는 초기 투자·고정비·인력 기회비용의 합계로, 거래변동비·추가 투자까지 포함한 총비용은 아닙니다.","note")
    return [b,d,k,v]

def mosigo_specs():
    m=sheeting("신사업투자심의","기존 수익모델 연결 · 8주 운영비와 기존 초기 투자 가정을 분리",
         ["투자 판단 지표","산출/금액","해석 및 연결 근거"],[42,25,91])
    src=[
      ("월 완료 예약(계획)",f("'사업성판단'!B6",199),"기존 수익모델 기준 · 실제 거래 실적과 구분"),
      ("제휴 수수료 매출/월(원)",f("'사업성판단'!B7",1592000),"기존 수익모델 연결"),
      ("건당 공헌이익(원)",f("'사업성판단'!B8",3700),"기존 수익모델 연결"),
      ("월 경제적 손익(원)",f("'사업성판단'!B9",-3263700),"기회비용 포함"),
      ("월 경제적 손익분기 건수",f("'사업성판단'!B10",1082),"고정비·기회비용 포함"),
      ("월 현금 손익분기 건수",f("ROUNDUP('가정'!B13/'사업성판단'!B8,0)",541),"고정비 200만 원만 포함"),
      ("8주 제한 운영 예산(원)",inp(4000000),"IR Deck 단계별 투자 승인 예산"),
      ("기존 초기 투자 가정(원)",f("'가정'!B19",5000000),"기존 원본 사업 가정. 8주 예산과 별도 항목으로 관리"),
      ("G0/P0 운영비(원)",inp(800000),"IR Deck 초기 검증 단계"),
      ("G1/P1 운영비(원)",inp(1200000),"IR Deck 제품·공급 검증 단계"),
      ("G2/P2 운영비(원)",inp(2000000),"IR Deck 사업화 확대 검토 단계")]
    for i,(label,value,note) in enumerate(src,5):
        for col,v in zip("ABC",[label,value,note]):put(m["cells"],f"{col}{i}",v)
    put(m["cells"],"A17","8주 파일럿 예산 합계(원)","head")
    put(m["cells"],"B17",f("SUM(B13:B15)",4000000))
    put(m["cells"],"C17","8주 400만 원 한도와 2027년 초기 투자 500만 원 가정은 기준·범위가 다르며 합산 여부는 심의 시 확인")
    put(m["cells"],"A18","8주 승인 예산 일치","head")
    put(m["cells"],"B18",f('IF(B17=B11,"일치","확인 필요")',"일치"))
    t=sheeting("3개년성장전략","성장 로드맵은 조건부 제안 · 검증되지 않은 연차별 매출 목표는 숫자로 표기하지 않음",
         ["연차","전략과제","자원배분/투자심의","관리 성과지표"],[12,56,75,58])
    years=[
       (1,"제휴형 초기 모델 정교화","8주 한도 집행 → 공급·수수료 조건 확인 후 승인","완료 예약·공헌이익·고객지원비·공급 가용 시간"),
       (2,"인접 생활권과 제휴 공급망 확대","지역별 운영비·획득비·공급 효율을 기준으로 투자 우선순위 선택","지역별 공헌이익·공급 유지·재예약"),
       (3,"기업·공공 채널 투자 대안 검토","채널별 영업비·운영 책임·현금 수요 비교 후 신규 투자 심의","반복 이용·계약 조건·현금소요")]
    for i,(year,task,alloc,kpis) in enumerate(years,5):
        for col,val in zip("ABCD",[year,task,alloc,kpis]):put(t["cells"],f"{col}{i}",val)
    put(t["cells"],"A10","초기 8주 투자 판단과 90일 재예약 성과평가는 관찰 기간이 다릅니다.","note")
    put(t["cells"],"A11","공급 20명 기준 월 완료 199건과 손익분기 1,082건의 차이를 사업 확대 전 비교합니다.","note")
    z=sheeting("투자민감도","수수료·신규 고객 획득비 가정 변경 시 손익분기 건수 재계산 / 계약 실적이 아닌 시나리오",
         ["대안","수수료율","신규 CAC(원)","공헌이익/건(원)","월 경제적 BEP(건)","월 손익(199건,원)","확대 판단"],[25,17,23,25,25,30,52])
    fees=[.18,.20,.22,.20,.20]
    cacs=[3000,3000,3000,4500,6000]
    label=["수수료 18%","기준 20%","수수료 22%","CAC 1.5배","CAC 2배"]
    for i,(fee,cac,desc) in enumerate(zip(fees,cacs,label)):
        row=5+i
        margin=round(40000*fee-40000*.03-1200-100-.6*cac)
        bep=math.ceil(4000000/margin) if margin>0 else "미성립"
        vals={
          "A":desc,"B":pct(fee),"C":inp(cac),
          "D":f(f"'가정'!$B$6*B{row}-'가정'!$B$6*'가정'!$B$8-'가정'!$B$9-'가정'!$B$10-'가정'!$B$11*C{row}",margin),
          "E":f(f'IF(D{row}<=0,"미성립",ROUNDUP((\'가정\'!$B$13+\'가정\'!$B$14)/D{row},0))',bep),
          "F":f(f"'사업성판단'!$B$6*D{row}-'가정'!$B$13-'가정'!$B$14",199*margin-4000000),
          "G":"수요·공급·계약비용을 함께 심의"}
        for col,val in vals.items():put(z["cells"],f"{col}{row}",val)
    put(z["cells"],"A11","기존 기본 동행 출시 가격 3만 원대와 4만 원 계산용 평균 이용가는 서로 다릅니다.","note")
    put(z["cells"],"A12","기존 초기 투자 500만 원 가정과 신규 8주 운영비 400만 원은 중복·잔여 금액 확정 전 서로 더하지 않습니다.","note")
    return [m,t,z]

def mkstyles(styles):
    # Preserve original cell formats and normalize all existing font faces.
    fonts=styles.find(q("fonts"))
    if fonts is None: raise RuntimeError("original styles missing fonts")
    for font in list(fonts):
        name=font.find(q("name"))
        if name is None: ET.SubElement(font,q("name"),{"val":"Pretendard"})
        else: name.set("val","Pretendard")
    colors={"title":"FF143F31","head":"FFFFFFFF","text":"FF263C33","note":"FF5A7163",
            "input":"FF0000FF","formula":"FF0A722C","percent":"FF0000FF"}
    additions=[]
    for k in ["title","head","text","note","input","formula","percent"]:
        font=ET.Element(q("font"))
        ET.SubElement(font,q("sz"),{"val":"17" if k=="title" else "11"})
        ET.SubElement(font,q("name"),{"val":"Pretendard"})
        ET.SubElement(font,q("color"),{"rgb":colors[k]})
        if k in ("title","head"):ET.SubElement(font,q("b"))
        fonts.append(font); additions.append((k,len(fonts)-1))
    fonts.set("count",str(len(fonts)))
    fills=styles.find(q("fills"))
    if fills is None:raise RuntimeError("original styles missing fills")
    dark=ET.SubElement(fills,q("fill"))
    pat=ET.SubElement(dark,q("patternFill"),{"patternType":"solid"})
    ET.SubElement(pat,q("fgColor"),{"rgb":"FF174A3A"});ET.SubElement(pat,q("bgColor"),{"indexed":"64"})
    headfill=len(fills)-1
    fills.set("count",str(len(fills)))
    fmts=styles.find(q("numFmts"))
    if fmts is None:
        fmts=ET.Element(q("numFmts"),{"count":"0"})
        styles.insert(0,fmts)
    existing=[int(n.attrib["numFmtId"]) for n in fmts.findall(q("numFmt")) if "numFmtId" in n.attrib]
    base=max([163]+existing)+1
    ET.SubElement(fmts,q("numFmt"),{"numFmtId":str(base),"formatCode":'#,##0;[Red](#,##0);"-"'})
    ET.SubElement(fmts,q("numFmt"),{"numFmtId":str(base+1),"formatCode":'0.0%;[Red](0.0%);"-"'})
    fmts.set("count",str(len(fmts)))
    xfs=styles.find(q("cellXfs"))
    if xfs is None:raise RuntimeError("original styles missing cellXfs")
    sids={}
    for k,fid in additions:
        attr={"numFmtId":str(base+1 if k=="percent" else (base if k in ("input","formula") else 0)),
              "fontId":str(fid),"fillId":str(headfill if k=="head" else 0),"borderId":"0",
              "xfId":"0","applyFont":"1","applyFill":"1","applyNumberFormat":"1","applyAlignment":"1"}
        xf=ET.SubElement(xfs,q("xf"),attr)
        ET.SubElement(xf,q("alignment"),{"vertical":"center","wrapText":"1"})
        sids[k]=len(xfs)-1
    xfs.set("count",str(len(xfs)))
    return sids

def xml_sheet(spec,styleids):
    cells=spec["cells"]
    root=ET.Element(q("worksheet"))
    ET.SubElement(root,q("dimension"),{"ref":"A1:L20"})
    views=ET.SubElement(root,q("sheetViews"))
    ET.SubElement(views,q("sheetView"),{"showGridLines":"0","workbookViewId":"0"})
    ET.SubElement(root,q("sheetFormatPr"),{"defaultRowHeight":"20"})
    cols=ET.SubElement(root,q("cols"))
    for i,width in enumerate(spec["widths"],1):
        ET.SubElement(cols,q("col"),{"min":str(i),"max":str(i),"width":str(width),"customWidth":"1"})
    data=ET.SubElement(root,q("sheetData"))
    rows={}
    for a,(value,manual_style) in cells.items():
        match=re.match(r"^([A-Z]+)([0-9]+)$",a)
        assert match,a
        row=int(match.group(2));rows.setdefault(row,[]).append((a,value,manual_style))
    def colnum(a):
        result=0
        for c in re.match(r"^[A-Z]+",a).group():result=result*26+ord(c)-64
        return result
    for r in sorted(rows):
        row=ET.SubElement(data,q("row"),{"r":str(r),"ht":("36" if r==1 else "28" if r!=2 else "38"),"customHeight":"1"})
        for address,val,manual in sorted(rows[r],key=lambda a:colnum(a[0])):
            if isinstance(val,tuple) and val[0]=="formula":
                style=manual or "formula"
            elif isinstance(val,tuple) and val[0]=="percent":
                style=manual or "percent"
            elif isinstance(val,tuple) and val[0]=="input":
                style=manual or "input"
            else:
                style=manual or ("text" if isinstance(val,str) else "formula")
            c=ET.SubElement(row,q("c"),{"r":address,"s":str(styleids[style])})
            if isinstance(val,tuple) and val[0]=="formula":
                expr,cache=val[1:]
                ET.SubElement(c,q("f")).text=expr
                if isinstance(cache,str):c.set("t","str")
                ET.SubElement(c,q("v")).text=str(cache)
            else:
                data_val=val[1] if isinstance(val,tuple) else val
                if isinstance(data_val,str):
                    c.set("t","inlineStr")
                    st=ET.SubElement(ET.SubElement(c,q("is")),q("t"))
                    st.text=data_val
                    if data_val.startswith(" ") or data_val.endswith(" "):st.set("{http://www.w3.org/XML/1998/namespace}space","preserve")
                elif isinstance(data_val,(float,int)):
                    ET.SubElement(c,q("v")).text=str(data_val)
                elif data_val is None:pass
                else:raise TypeError((address,data_val))
    # Long notes, document header and overview span the whole sheet rather than clipping in column A.
    final_col=chr(64+len(spec["widths"]))
    merge_rows=sorted(r for r,entry in rows.items() if r in (1,2) or
                      (len(entry)==1 and entry[0][0].startswith("A") and r>=10))
    if merge_rows:
        merges=ET.SubElement(root,q("mergeCells"),{"count":str(len(merge_rows))})
        for rr in merge_rows:
            ET.SubElement(merges,q("mergeCell"),{"ref":f"A{rr}:{final_col}{rr}"})
    ET.SubElement(root,q("pageMargins"),{"left":"0.4","right":"0.4","top":"0.5","bottom":"0.5","header":"0.2","footer":"0.2"})
    return ET.tostring(root,encoding="utf-8",xml_declaration=True)

def workbook_stats(binary):
    with ZipFile(binary) as z:
        w=ET.fromstring(z.read("xl/workbook.xml"))
        names=[s.get("name") for s in w.find(q("sheets"))]
        count=sum(len(ET.fromstring(z.read(n)).findall(".//"+q("f"))) for n in z.namelist() if re.fullmatch(r"xl/worksheets/sheet\d+\.xml",n))
        errs=sum(len([c for c in ET.fromstring(z.read(n)).findall(".//"+q("c")) if c.get("t")=="e"]) for n in z.namelist() if re.fullmatch(r"xl/worksheets/sheet\d+\.xml",n))
        return names,count,errs

def sync(path,project):
    spec=footmate_specs() if project=="footmate" else mosigo_specs()
    expected=[x["name"] for x in spec]
    with ZipFile(path) as zin:
        raw={name:zin.read(name) for name in zin.namelist()}
        src_names,src_formulas,src_errors=workbook_stats(path)
        assert src_errors==0,(project,src_errors)
        if set(expected).issubset(src_names):
            assert src_names[-len(expected):]==expected,src_names
            assert "Pretendard" in raw["xl/styles.xml"].decode(errors="ignore")
            print("PASS existing strategy model",project,"sheets",len(src_names),"formulas",src_formulas)
            return
        assert not set(expected)&set(src_names),("partial strategy workbook",src_names,expected)
        assert (len(src_names)==6 if project=="footmate" else len(src_names)==5),(project,src_names)
        preserved={n:hashlib.sha256(blob).hexdigest() for n,blob in raw.items() if re.fullmatch(r"xl/worksheets/sheet\d+\.xml",n)}
        style=ET.fromstring(raw["xl/styles.xml"])
        sids=mkstyles(style)
        raw["xl/styles.xml"]=ET.tostring(style,encoding="utf-8",xml_declaration=True)
        workbook=ET.fromstring(raw["xl/workbook.xml"])
        sheets=workbook.find(q("sheets"))
        rels=ET.fromstring(raw["xl/_rels/workbook.xml.rels"])
        content=ET.fromstring(raw["[Content_Types].xml"])
        nameset=set(raw.keys())
        max_sheet_part=max(int(re.search(r"sheet(\d+)\.xml",n).group(1)) for n in nameset if re.fullmatch(r"xl/worksheets/sheet\d+\.xml",n))
        max_sheetid=max(int(s.get("sheetId")) for s in sheets)
        ridset={r.get("Id") for r in rels}
        maxrid=max([0]+[int(v[3:]) for v in ridset if v.startswith("rId") and v[3:].isdigit()])
        for i,new in enumerate(spec,1):
            sid=max_sheetid+i
            rid=f"rId{maxrid+i}"
            while rid in ridset:
                maxrid+=1;rid=f"rId{maxrid+i}"
            ridset.add(rid)
            part=f"xl/worksheets/sheet{max_sheet_part+i}.xml"
            assert part not in nameset,part
            raw[part]=xml_sheet(new,sids)
            ET.SubElement(sheets,q("sheet"),{"name":new["name"],"sheetId":str(sid),tag(O,"id"):rid})
            ET.SubElement(rels,tag(P,"Relationship"),{"Id":rid,"Type":O+"/worksheet","Target":f"worksheets/sheet{max_sheet_part+i}.xml"})
            ET.SubElement(content,tag(C,"Override"),{"PartName":"/"+part,"ContentType":"application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"})
        calc=workbook.find(q("calcPr"))
        if calc is None:calc=ET.SubElement(workbook,q("calcPr"))
        calc.attrib.update({"calcMode":"auto","fullCalcOnLoad":"1","forceFullCalc":"1"})
        raw["xl/workbook.xml"]=ET.tostring(workbook,encoding="utf-8",xml_declaration=True)
        raw["xl/_rels/workbook.xml.rels"]=ET.tostring(rels,encoding="utf-8",xml_declaration=True)
        raw["[Content_Types].xml"]=ET.tostring(content,encoding="utf-8",xml_declaration=True)
        # Excel's file properties must list the same worksheet titles/count as the workbook.
        if "docProps/app.xml" in raw:
            app=ET.fromstring(raw["docProps/app.xml"])
            AP="{http://schemas.openxmlformats.org/officeDocument/2006/extended-properties}"
            VT="{http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes}"
            titles=app.find(AP+"TitlesOfParts/"+VT+"vector")
            if titles is not None:
                for item in spec:ET.SubElement(titles,VT+"lpstr").text=item["name"]
                titles.set("size",str(len(titles)))
            pairs=app.find(AP+"HeadingPairs/"+VT+"vector")
            if pairs is not None:
                variants=pairs.findall(VT+"variant")
                for idx in range(len(variants)-1):
                    label=variants[idx].find(VT+"lpstr")
                    count=variants[idx+1].find(VT+"i4")
                    if label is not None and label.text=="Worksheets" and count is not None:
                        count.text=str(len(sheets))
            raw["docProps/app.xml"]=ET.tostring(app,encoding="utf-8",xml_declaration=True)
    output=path.with_suffix(".strategy.tmp.xlsx")
    with ZipFile(output,"w",ZIP_DEFLATED,compresslevel=6) as z:
        for name,b in raw.items():z.writestr(name,b)
    with ZipFile(output) as z:
        assert z.testzip() is None
        for part,h in preserved.items():assert hashlib.sha256(z.read(part)).hexdigest()==h,("original sheet modified",part)
        updated,formulas,errors=workbook_stats(output)
        assert updated==src_names+expected,(updated,src_names,expected)
        assert formulas>=src_formulas+25,(formulas,src_formulas)
        assert errors==0
        for new in spec:
            assert any(new["name"]==name for name in updated)
        st=ET.fromstring(z.read("xl/styles.xml"))
        assert {f.find(q("name")).get("val") for f in st.find(q("fonts"))}=={"Pretendard"}
        if project=="footmate":
            assert src_formulas>=280,("footmate original formula count",src_formulas)
            assert b"5640" in z.read("xl/worksheets/sheet"+str(len(src_names)+2)+".xml")
        else:
            assert src_formulas>=54,("mosigo original formula count",src_formulas)
            assert b"5000000" in z.read("xl/worksheets/sheet"+str(len(src_names)+1)+".xml")
        print(f"PASS {project} strategy sync: {len(src_names)} original sheets +{len(spec)} append, {src_formulas} original formula cells preserved, {formulas} total formulas, all fonts Pretendard, zero cached errors")
    os.replace(output,path)

if __name__=="__main__":
    project=sys.argv[1] if len(sys.argv)>1 else "footmate"
    path=Path("src/case-study/downloads/footmate_model.xlsx" if project=="footmate" else "downloads/mosigo_model.xlsx")
    sync(path,project)
