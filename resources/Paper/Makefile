Paper.pdf: Paper.md Paper.bib DB.png Use.png eisvogel.latex
	pandoc Paper.md -o Paper.pdf \
		--template eisvogel \
		--listings \
		--filter pandoc-citeproc
	
# ERD.pdf: ERD.gv
#	neato -T pdf ERD.gv > ERD.pdf

DB.png: DB.plantuml
	plantuml DB.plantuml

Use.png: Use.plantuml
	plantuml Use.plantuml
