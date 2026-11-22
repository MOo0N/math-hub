#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""把 src/ 下的模块拼装成单文件 HTML，供资料库发布。"""
import os,re,sys

ROOT=os.path.dirname(os.path.abspath(__file__))
SRC=os.path.join(ROOT,'src')
OUT=os.path.join(ROOT,'dist','index.html')

def read(name):
    with open(os.path.join(SRC,name),encoding='utf-8') as f:
        return f.read()

def main():
    shell=read('shell.html')
    css=read('styles.css')
    engine=read('engine.js')
    app=read('app.js')
    # 按文件名排序收集所有 models-*.js
    model_files=sorted(f for f in os.listdir(SRC) if f.startswith('models-') and f.endswith('.js'))
    models='\n'.join(read(f) for f in model_files)
    html=shell.replace('/*__CSS__*/',css)
    html=html.replace('/*__ENGINE__*/',engine)
    html=html.replace('/*__MODELS__*/',models)
    html=html.replace('/*__APP__*/',app)
    os.makedirs(os.path.dirname(OUT),exist_ok=True)
    with open(OUT,'w',encoding='utf-8') as f:
        f.write(html)
    # 统计
    nmodels=len(re.findall(r'\bR\(\s*[a-zA-Z_$][\w$]*\s*\)',models))
    print('模型注册数(近似):',nmodels)
    print('模型文件:',', '.join(model_files))
    print('输出:',OUT,'大小:',len(html.encode('utf-8')),'bytes')

if __name__=='__main__':
    main()
