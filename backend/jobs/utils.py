import PyPDF2

def get_resume_text(resume_path):
    with open(resume_path, 'rb') as pdf_file:
        reader = PyPDF2.PdfReader(pdf_file)
        resume_text = ''
        for page in reader.pages:
            resume_text += page.extract_text()
    return resume_text
