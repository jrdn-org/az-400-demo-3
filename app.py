from flask import Flask, render_template, jsonify, request
import json
import time
import random

app = Flask(__name__)

# Sample data for the app
projects = [
    {"id": 1, "name": "AI Assistant", "status": "active", "progress": 85},
    {"id": 2, "name": "Web Dashboard", "status": "completed", "progress": 100},
    {"id": 3, "name": "Mobile App", "status": "in-progress", "progress": 60},
    {"id": 4, "name": "Data Pipeline", "status": "planning", "progress": 20}
]

# Collection of hilarious jokes for the funny site
jokes = [
    {
        "setup": "Why did the developer go broke?",
        "punchline": "Because he used up all his cache!",
        "category": "programming"
    },
    {
        "setup": "Why do programmers prefer dark mode?",
        "punchline": "Because light attracts bugs!",
        "category": "programming"
    },
    {
        "setup": "What do you call a fake noodle?",
        "punchline": "An impasta!",
        "category": "food"
    },
    {
        "setup": "Why don't skeletons fight each other?",
        "punchline": "They don't have the guts!",
        "category": "pun"
    },
    {
        "setup": "What did the ocean say to the beach?",
        "punchline": "Nothing, it just waved!",
        "category": "pun"
    },
    {
        "setup": "Why did the scarecrow win an award?",
        "punchline": "Because he was outstanding in his field!",
        "category": "pun"
    },
    {
        "setup": "What do you call cheese that isn't yours?",
        "punchline": "Nacho cheese!",
        "category": "food"
    },
    {
        "setup": "Why did the bicycle fall over?",
        "punchline": "It was two-tired!",
        "category": "pun"
    },
    {
        "setup": "What do you call a belt made of watches?",
        "punchline": "A waist of time!",
        "category": "pun"
    },
    {
        "setup": "Why don't eggs tell jokes?",
        "punchline": "They'd crack each other up!",
        "category": "food"
    },
    {
        "setup": "What did one plate say to the other plate?",
        "punchline": "Tonight, dinner's on me!",
        "category": "food"
    },
    {
        "setup": "Why did the math book look sad?",
        "punchline": "Because it had too many problems!",
        "category": "school"
    }
]

@app.route('/')
def home():
    return render_template('index.html', projects=projects)

@app.route('/api/projects')
def get_projects():
    return jsonify(projects)

@app.route('/api/projects/<int:project_id>', methods=['GET', 'POST'])
def project_detail(project_id):
    project = next((p for p in projects if p['id'] == project_id), None)
    if not project:
        return jsonify({"error": "Project not found"}), 404

    if request.method == 'POST':
        data = request.get_json()
        if 'progress' in data:
            project['progress'] = min(100, max(0, data['progress']))
        return jsonify(project)

    return jsonify(project)

@app.route('/api/stats')
def get_stats():
    total_projects = len(projects)
    completed = len([p for p in projects if p['status'] == 'completed'])
    active = len([p for p in projects if p['status'] == 'active'])
    avg_progress = sum(p['progress'] for p in projects) / total_projects

    return jsonify({
        "total_projects": total_projects,
        "completed": completed,
        "active": active,
        "average_progress": round(avg_progress, 1)
    })

@app.route('/api/joke')
def get_random_joke():
    joke = random.choice(jokes)
    return jsonify(joke)

@app.route('/api/jokes/<category>')
def get_joke_by_category(category):
    category_jokes = [joke for joke in jokes if joke['category'] == category]
    if not category_jokes:
        return jsonify({"error": "No jokes found for this category"}), 404

    joke = random.choice(category_jokes)
    return jsonify(joke)

@app.route('/api/joke-categories')
def get_joke_categories():
    categories = list(set(joke['category'] for joke in jokes))
    return jsonify({"categories": categories})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8080)