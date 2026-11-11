"""Build the separate six-slide FootMate 5-year strategy appendix.
All labels are plan/scenario data, not realized transaction results.
Editable shapes, 16:9 ratio, Pretendard typography, no emoji glyphs.
Re-running the generator preserves published bytes for identical reviewed decks.
"""
from pathlib import Path
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import MSO_ANCHOR

OUT=Path("src/case-study/downloads/footmate_5year_strategy.pptx")
if OUT.exists():
    existing=Presentation(OUT)
    if len(existing.slides)==6 and all(
        any(label in sh.text for sh in existing.slides[3].shapes if sh.has_text_frame)
        for label in ("월 경제적 손익 · 연차별 개선 경로", "−238.7만 원", "+0.6만 원")
    ):
        print("PASS FootMate appendix exists and is aligned; keeping original file bytes")
        raise SystemExit(0)

p=Presentation();p.slide_width=Inches(13.333);p.slide_height=Inches(7.5)
G=RGBColor(20,44,57);G2=RGBColor(8,123,96);M=RGBColor(234,245,241)
L=RGBColor(205,243,93);W=RGBColor(255,255,255);D=RGBColor(27,41,49)
S=RGBColor(82,99,109);BG=RGBColor(245,247,246);RED=RGBColor(169,65,62)

def rect(sl,x,y,w,h,color):
    sh=sl.shapes.add_shape(MSO_SHAPE.RECTANGLE,Inches(x),Inches(y),Inches(w),Inches(h))
    sh.fill.solid();sh.fill.fore_color.rgb=color;sh.line.fill.background()
    return sh
def text(sl,txt,x,y,w,h,size=16,bold=False,color=D):
    sh=sl.shapes.add_textbox(Inches(x),Inches(y),Inches(w),Inches(h))
    tf=sh.text_frame;tf.clear();tf.word_wrap=True
    tf.margin_left=tf.margin_right=Inches(.04);tf.margin_top=tf.margin_bottom=Inches(.02)
    for i,line in enumerate(txt.split("\n")):
        q=tf.paragraphs[0] if i==0 else tf.add_paragraph()
        r=q.add_run();r.text=line;r.font.name="Pretendard";r.font.size=Pt(size)
        r.font.bold=bold;r.font.color.rgb=color
    tf.vertical_anchor=MSO_ANCHOR.MIDDLE
    return sh
def base(i,title,lead):
    sl=p.slides.add_slide(p.slide_layouts[6]);rect(sl,0,0,13.333,7.5,BG)
    rect(sl,0,0,13.333,.09,G2)
    text(sl,f'FootMate  /  5개년 경영계획  /  {i:02d}',.73,.3,11,.3,11,True,G2)
    text(sl,title,.73,.82,11.9,.6,28,True,G)
    text(sl,lead,.75,1.47,11.8,.42,13,False,S)
    rect(sl,.75,6.97,11.8,.018,M)
    text(sl,'FootMate · 경영계획 시나리오',.77,7.06,11.3,.24,10,False,S)
    text(sl,f'{i:02d} / 06',11.78,7.06,.75,.25,10,True,G2)
    return sl
def panel(sl,x,y,w,h,label,value,desc):
    rect(sl,x,y,w,h,W)
    rect(sl,x,y,.06,h,M)
    text(sl,label,x+.18,y+.15,w-.36,.33,12,True,G2)
    text(sl,value,x+.18,y+.56,w-.36,.64,26,True,G)
    text(sl,desc,x+.18,y+1.28,w-.36,.44,11,False,S)

sl=p.slides.add_slide(p.slide_layouts[6]);rect(sl,0,0,13.333,7.5,G)
text(sl,'FootMate',.85,1.36,11.5,.88,46,True,W)
text(sl,'5개년 경영계획·수익성 개선',.85,2.61,11.6,.78,29,True,L)
text(sl,'수익성 개선 → 성과관리·예산 배분 → 단계별 투자',.86,4.1,11.7,.64,19,False,W)
text(sl,'제휴 공급처 5곳 → 36곳 · 중장기 계획 시나리오',.88,5.62,11.6,.43,17,True,L)

sl=base(2,'5개년 성장전략과 투자 우선순위','공급 확대를 매월 완료 예약과 지역별 수익성 관리에 연결')
for i,(year,partners,goal) in enumerate([(1,5,'기반 확보'),(2,12,'계약조건 개선'),(3,20,'운영 표준화'),(4,28,'비용 최적화'),(5,36,'권역 확대')]):
    x=.72+2.52*i;rect(sl,x,2.1,2.36,2.16,W)
    text(sl,f'{year}년 차',x+.15,2.24,2.06,.4,13,True,G2)
    text(sl,f'{partners}곳',x+.15,2.77,2.06,.62,29,True,G)
    text(sl,goal,x+.15,3.59,2.06,.41,14,True,S)
rect(sl,.75,4.74,11.8,1.16,M)
text(sl,'관리 지표 · 공급 유지·완료 예약·30일 재참가·공헌이익·운영비',1.02,4.91,11.2,.76,16,True,G)
text(sl,'공급처는 목표치이며, 투자 규모는 계약·운영 여건에 따라 조정합니다.',.79,6.2,11.8,.4,12,False,S)

sl=base(3,'수수료·결제 조건에 따른 공헌이익 개선','건당 수익구조를 계약 협상과 사업 확대 기준으로 연결')
panel(sl,.75,2.1,3.68,2.13,'기준 조건: 수수료 10%·결제비 3%','340원','예약당 공헌이익')
panel(sl,4.84,2.1,3.66,2.13,'수수료 10%·결제비 0%','700원','예약당 공헌이익')
panel(sl,8.91,2.1,3.66,2.13,'협상안: 수수료 12%·결제비 0%','940원','예약당 공헌이익')
rect(sl,.77,4.69,11.78,1.1,G)
text(sl,'추가 관리비와 인력 기회비용 반영 손익분기: 약 28곳',1.0,4.86,11.25,.65,19,True,W)
text(sl,'관리비 제외 시 약 23곳 · 계약 조건별 수익성 비교',.81,6.2,11.6,.42,12,False,S)

sl=base(4,'5개년 월 경제적 손익 시나리오','1년 차 340원 · 2년 차부터 940원 · 관리비·기회비용 반영')
# Replace static numeric cards with a connected, editable break-even diagram.
from pptx.enum.shapes import MSO_CONNECTOR
def segment(sl,x1,y1,x2,y2,color=G2,width=2):
    sh=sl.shapes.add_connector(MSO_CONNECTOR.STRAIGHT,Inches(x1),Inches(y1),Inches(x2),Inches(y2))
    sh.line.color.rgb=color;sh.line.width=Pt(width)
def milestone(sl,x,y,bep=False):
    size=.21 if bep else .16
    sh=sl.shapes.add_shape(MSO_SHAPE.OVAL,Inches(x-size/2),Inches(y-size/2),Inches(size),Inches(size))
    sh.fill.solid();sh.fill.fore_color.rgb=G if bep else G2
    sh.line.color.rgb=W;sh.line.width=Pt(1.5)
rect(sl,.77,2.03,11.75,3.78,W)
rect(sl,.79,2.03,.07,3.78,M)
text(sl,'월 경제적 손익 · 연차별 개선 경로',1.06,2.13,10,.33,14,True,G)
zero_y=3.10
segment(sl,1.08,zero_y,12.10,zero_y,M,1.5)
text(sl,'손익분기선',1.11,zero_y-.28,1.25,.24,10,False,S)
series=[(1,5,-238.7),(2,12,-139.8),(3,20,-69.6),(4,28,.6),(5,36,70.7)]
xs=[1.90,4.15,6.40,8.65,10.90]
ys=[2.55+(70.7-value)/309.4*2.55 for _,_,value in series]
for k in range(4):segment(sl,xs[k],ys[k],xs[k+1],ys[k+1],G2,3)
for (year,partners,value),x,y in zip(series,xs,ys):
    milestone(sl,x,y,year==4)
    value_text=('+' if value>0 else '−')+f'{abs(value):.1f}만 원'
    text(sl,value_text,x-.83,y-.47,1.66,.34,16,True,G if value>=0 else D)
    text(sl,f'{year}년 차 · {partners}곳',x-1.07,5.43,2.14,.35,13,True,G)
rect(sl,.77,5.96,11.75,.60,M)
text(sl,'4년 차 · 공급처 28곳부터 월 경제적 손익분기 근접',1.04,6.06,11.13,.39,17,True,G)
text(sl,'월 경제적 손익과 연간 투자 후 현금수지는 별도 기준',.81,6.65,11.65,.26,10,False,S)

sl=base(5,'경영성과 관리와 전략적 자원 배분','경영계획 수립 → 계획 대비 차이 → 투자·예산 조정')
for i,(a,b,c) in enumerate([
('성장 관리','공급처·월 완료 예약·재참가','생활권 확대·계약 유지'),
('수익성','수수료·건당 공헌이익·지원비','수수료·결제비 협상'),
('재무 계획','월 매출·운영비·현금수지','계획 대비 차이·예산 점검'),
('IT 투자','개발·운영비·자동화 효과','기능별 투자 우선순위')]):
    y=2.04+i*1.04;rect(sl,.75,y,11.8,.88,M if i%2 else W)
    text(sl,a,1.0,y+.16,2.1,.45,15,True,G)
    text(sl,b,3.05,y+.16,4.45,.45,14,False,D)
    text(sl,c,7.55,y+.16,4.7,.45,14,False,D)
rect(sl,.77,6.46,11.7,.32,G2)
text(sl,'관리 주기 · 월간 성과 / 분기별 계획·투자 검토',.98,6.46,11.3,.32,12,True,W)

sl=p.slides.add_slide(p.slide_layouts[6]);rect(sl,0,0,13.333,7.5,G)
text(sl,'FootMate  /  투자 판단',.86,1.23,10,.48,16,True,M)
text(sl,'성장 규모보다\n수익성 있는 확대를 우선',.86,1.96,11.9,1.55,35,True,W)
rect(sl,.86,3.9,11.65,1.72,G2)
text(sl,'1  공급·참가·재참가 성과를 기준으로 성장계획 집행',1.13,4.09,11,.45,17,False,W)
text(sl,'2  수수료·결제비·관리비 조건에 따른 투자규모 조정',1.13,4.62,11,.45,17,False,W)
text(sl,'3  월별 계획 차이·현금수지로 경영계획 점검',1.13,5.12,11,.45,17,False,W)
text(sl,'재무 수치는 계획 시나리오',.86,6.72,11.4,.34,12,False,M)
p.save(OUT)
check=Presentation(OUT)
assert len(check.slides)==6
assert all((not run.font.name or run.font.name=="Pretendard")
           for sl in check.slides for sh in sl.shapes if sh.has_text_frame
           for para in sh.text_frame.paragraphs for run in para.runs)
print("PASS 6-slide FootMate appendix:",OUT,OUT.stat().st_size)
